import { useState, useEffect } from 'react'
import Waterfall from './components/Waterfall'

function App() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  // 模拟加载图片数据
  const loadImages = async (page = 1) => {
    setLoading(true)
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成随机尺寸的图片数据
    const newImages = Array.from({ length: 12 }, (_, index) => {
      const id = (page - 1) * 12 + index + 1
      const width = Math.floor(Math.random() * 300) + 200
      const height = Math.floor(Math.random() * 400) + 200
      return {
        id,
        src: `https://picsum.photos/seed/${id}/${width}/${height}`,
        width,
        height
      }
    })
    
    setImages(prev => [...prev, ...newImages])
    setLoading(false)
  }

  useEffect(() => {
    loadImages()
  }, [])

  return (
    <div className="waterfall-container">
      <h1>React Waterfall Component</h1>
      <Waterfall 
        images={images}
        onLoadMore={() => loadImages(Math.floor(images.length / 12) + 1)}
        loading={loading}
        columns={3}
      />
    </div>
  )
}

export default App