import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { adminId } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

type Group = {
  slug: string;
  name: string;
  description: string;
  category: string;
  price: string;
  mrp: string;
  images: string[];
  variants: Map<string, { color: string; size: string; price: string; mrp: string }>;
};

export async function POST(req: NextRequest) {
  if (!await adminId()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a CSV file' }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'CSV must be smaller than 4 MB' }, { status: 400 });

  try {
    const rows = parse(await file.text(), { skip_empty_lines: true, relax_quotes: true, bom: true }) as string[][];
    if (rows.length < 2) return NextResponse.json({ error: 'CSV has no product rows' }, { status: 400 });

    const headers = rows[0].map(x => String(x || '').trim());
    const normalized = headers.map(x => x.toLowerCase());
    const shopify = normalized.includes('handle') && normalized.includes('image src');
    let mapping: Record<string, number> = {};
    try { mapping = form.get('mapping') ? JSON.parse(String(form.get('mapping'))) : {}; } catch { /* use defaults */ }

    const defaults: Record<string, number> = {
      unique_name: 0, name: 1, description: 2, color: 9,
      selling_price: 20, mrp: 21, img1: 25, img2: 26, img3: 27, img4: 28, img5: 29,
    };
    const col = (row: string[], field: string) => {
      const index = Number(mapping[field] ?? defaults[field]);
      return Number.isInteger(index) && index >= 0 ? String(row[index] || '').trim() : '';
    };

    const groups = new Map<string, Group>();
    let lastSlug = '', lastName = '', lastDescription = '', lastPrice = '', lastMrp = '';
    const indexOf = (name: string) => normalized.indexOf(name.toLowerCase());

    for (const row of rows.slice(1)) {
      let slug = '', name = '', description = '', color = '', size = '', price = '', mrp = '', category = '';
      const imageList: string[] = [];

      if (shopify) {
        slug = String(row[indexOf('handle')] || '').trim() || lastSlug;
        name = String(row[indexOf('title')] || '').trim() || lastName;
        description = String(row[indexOf('body (html)')] || '').trim() || lastDescription;
        price = String(row[indexOf('variant price')] || '').trim() || lastPrice;
        mrp = String(row[indexOf('variant compare at price')] || '').trim() || lastMrp;
        category = String(row[indexOf('type')] || '').trim();
        for (let option = 1; option <= 3; option++) {
          const optionName = String(row[indexOf(`option${option} name`)] || '').trim().toLowerCase();
          const optionValue = String(row[indexOf(`option${option} value`)] || '').trim();
          if (optionName === 'color' || optionName === 'colour') color = optionValue;
          if (optionName === 'size') size = optionValue;
        }
        const image = String(row[indexOf('image src')] || '').trim();
        if (image) imageList.push(image);
      } else {
        slug = col(row, 'unique_name') || lastSlug;
        name = col(row, 'name') || lastName;
        description = col(row, 'description') || lastDescription;
        color = col(row, 'color');
        price = col(row, 'selling_price') || lastPrice;
        mrp = col(row, 'mrp') || lastMrp;
        for (const field of ['img1', 'img2', 'img3', 'img4', 'img5']) {
          const image = col(row, field);
          if (image) imageList.push(image);
        }
      }

      if (!slug && !name && !color) continue;
      if (!slug) slug = (name || lastName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (!slug) continue;

      lastSlug = slug;
      lastName = name || lastName;
      lastDescription = description || lastDescription;
      lastPrice = price || lastPrice;
      lastMrp = mrp || lastMrp;

      let group = groups.get(slug);
      if (!group) {
        group = { slug, name: name || slug, description, category, price: price || '0', mrp: mrp || '0', images: [], variants: new Map() };
        groups.set(slug, group);
      }
      if (name) group.name = name;
      if (description) group.description = description;
      if (category) group.category = category;
      if (price) group.price = price;
      if (mrp) group.mrp = mrp;
      for (const image of imageList) if (image && !group.images.includes(image) && group.images.length < 5) group.images.push(image);
      if (color || size) {
        const key = `${color}|${size}|${price}|${mrp}`;
        if (!group.variants.has(key)) group.variants.set(key, { color, size, price: price || group.price, mrp: mrp || group.mrp });
      }
    }

    if (!groups.size) return NextResponse.json({ error: 'No valid product rows found. Check the column mapping.' }, { status: 400 });

    // Import in small chunks so large Shopify files do not exceed one Vercel
    // function execution window. Re-running a chunk is safe: products update
    // by unique_name and their variant rows are replaced transactionally.
    const batchSize = Math.max(5, Math.min(40, Number(form.get('batchSize')) || 20));
    const offset = Math.max(0, Number(form.get('offset')) || 0);
    const allGroups = [...groups.values()];
    const batch = allGroups.slice(offset, offset + batchSize);
    const conn = await db().getConnection();
    let imported = 0;

    try {
      await conn.beginTransaction();
      const [categoryRows] = await conn.execute('SELECT id,cat_name FROM category');
      const categoryMap = new Map<string, number>();
      for (const row of categoryRows as any[]) categoryMap.set(String(row.cat_name).trim().toLowerCase(), Number(row.id));
      const slugs = batch.map(group => group.slug);
      const existingMap = new Map<string, number>();
      if (slugs.length) {
        const placeholders = slugs.map(() => '?').join(',');
        const [existingRows] = await conn.execute(`SELECT id,unique_name FROM tbl_product WHERE unique_name IN (${placeholders})`, slugs);
        for (const row of existingRows as any[]) existingMap.set(String(row.unique_name), Number(row.id));
      }

      for (const group of batch) {
        const categoryId = categoryMap.get(group.category.trim().toLowerCase()) || 0;
        const values = [group.name, categoryId, Number(group.price) || 0, Number(group.mrp) || 0, group.description, ...[0, 1, 2, 3, 4].map(i => group.images[i] || '')];
        let productId = existingMap.get(group.slug);

        if (productId) {
          await conn.execute(
            'UPDATE tbl_product SET name=?,category=?,selling_price=?,mrp=?,fetaures=?,img1=?,img2=?,img3=?,img4=?,img5=?,from_csv=1 WHERE id=?',
            [...values, productId],
          );
          await conn.execute('DELETE FROM tbl_product_verient WHERE product_id=?', [productId]);
        } else {
          const [inserted] = await conn.execute(
            'INSERT INTO tbl_product (`index`,unique_name,name,is_show,category,selling_price,mrp,fetaures,img1,img2,img3,img4,img5,from_csv) VALUES (10000,?,?,1,?,?,?,?,?,?,?,?,?,1)',
            [group.slug, ...values],
          );
          productId = Number((inserted as any).insertId);
        }

        const variants = group.variants.size
          ? [...group.variants.values()]
          : [{ color: '', size: '', price: group.price, mrp: group.mrp }];
        for (const variant of variants) {
          await conn.execute(
            'INSERT INTO tbl_product_verient (product_id,name,color,color_code,size,storage,selling_price,mrp,fetaures,img1,img2,img3,img4,img5,from_csv) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)',
            [productId, group.name, variant.color || '', '', variant.size || null, null, Number(variant.price) || 0, Number(variant.mrp) || 0, group.description, ...[0, 1, 2, 3, 4].map(i => group.images[i] || '')],
          );
        }
        imported++;
      }
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }

    const nextOffset = offset + batch.length;
    return NextResponse.json({
      ok: true,
      imported,
      rows: rows.length - 1,
      shopify,
      totalGroups: allGroups.length,
      nextOffset,
      done: nextOffset >= allGroups.length,
    });
  } catch (error) {
    console.error('CSV import', error);
    return NextResponse.json({ error: 'CSV import failed. Verify the selected columns and CSV format.' }, { status: 400 });
  }
}
