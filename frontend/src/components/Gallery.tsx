"use client"
import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material'
type GalleryProps = {
  folder: string;
};

const Gallery: React.FC<GalleryProps> = ({ folder }) => {
  const [images, setImages] = useState<string[]>([]); // 存储图片链接
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息

  // 当文件夹路径变化时重新加载图片
  useEffect(() => {
    if (!folder) return; // 如果 folder 为空，不加载图片

    setLoading(true); // 开始加载
    setError(null); // 清除之前的错误

    // 发起请求加载该文件夹中的图片
    fetch(`http://127.0.0.1:5000/api/images?path=${encodeURIComponent(folder)}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data) {
          setImages(data); // 设置图片列表
        } else {
          setError('没有找到图片');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError('加载图片失败');
        console.error(err);
      });
  }, [folder]); // 每当 folder 改变时重新执行
  const getName=(url:string)=>{
    const parsedUrl = new URL(url)
const file = parsedUrl.searchParams.get('file')
return file
  }
  // 渲染图片
  const renderImages = () => {
    if (loading) {
      return <div>加载中...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
        <Box display="flex" flexDirection="column" gap={3} mt={3}>
                {images.map((url, i) => (
                    <div>
                        <h1>{getName(url)}</h1>
 <img

key={i}
src={url}
alt={`img-${i}`}
style={{
  height: 'auto',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}}
/>
                    </div>
                 
                ))}
              </Box>
    );
  };

  return (
    <div>
      <h3>当前文件夹：{folder}</h3>
      {renderImages()}
    </div>
  );
};

export default Gallery;
