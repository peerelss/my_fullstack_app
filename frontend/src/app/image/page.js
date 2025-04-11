'use client'
import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material'

export default function Gallery() {
  const [folder, setFolder] = useState('')
  const [inputValue, setInputValue] = useState('d:\\image')
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)

  const fetchImages = async (folderName) => {
    if (!folderName) {
      setError('请输入文件夹名')
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/api/images?folder=${folderName}`)
      const data = await res.json()
      if (res.ok) {
        setImages(data)
        setFolder(folderName)
        setError(null)
      } else {
        setImages([])
        setError(data.error || '发生错误')
      }
    } catch (err) {
      setImages([])
      setError('无法连接服务器')
    }
  }

  const handleSubmit = () => {
    fetchImages(inputValue.trim())
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        图片画廊
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField
          label="图片文件夹名"
          variant="outlined"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleSubmit}>
          加载图片
        </Button>
      </Stack>

      {folder && (
        <Typography variant="subtitle1" gutterBottom>
          当前文件夹：<strong>{folder}</strong>
        </Typography>
      )}

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Box display="flex" flexDirection="column" gap={3} mt={3}>
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`img-${i}`}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        ))}
      </Box>
    </Container>
  )
}
