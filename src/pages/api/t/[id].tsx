import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    html: `<img
    src="https://picsum.photos/200/300"
    width="200"
    height="300"
  />`,
  });
};
