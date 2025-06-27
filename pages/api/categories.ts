import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

// GET /api/categories
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 허용된 메서드 확인
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Supabase에서 카테고리 조회
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('order', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 조회 결과 반환
  return res.status(200).json(data);
}
