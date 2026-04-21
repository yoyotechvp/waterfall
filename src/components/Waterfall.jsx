import { useState, useEffect, useRef } from 'react'

const Waterfall = ({ images, onLoadMore, loading, columns = 3 }) => {
  const [columnHeights, setColumnHeights] = useState(Array(columns).fill(0))
  const [imagePositions, setImagePositions] = useState(Array(columns).fill([]))
  const containerRef = useRef(null)

  // 计算图片位置
  useEffect(() => {
    if (images.length === 0) return

    const newColumnHeights = Array(columns).fill(0)
    const newImagePositions = Array(columns).fill().map(() => [])

    images.forEach((image) => {
      // 找到最短的列
      const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights))
      
      // 计算图片在该列的位置
      newImagePositions[minHeightIndex].push(image)
      // 更新列高度
      newColumnHeights[minHeightIndex] += image.height / image.width * 100 // 使用相对高度
    })

    setColumnHeights(newColumnHeights)
    setImagePositions(newImagePositions)
  }, [images, columns])

  // 监听滚动事件，实现懒加载
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return
      
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // 当滚动到距离底部100px时触发加载更多
      if (scrollTop + windowHeight >= documentHeight - 100) {
        onLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, onLoadMore])

  return (
    <div className="waterfall-container" ref={containerRef}>
      <div className="waterfall-grid">
        {imagePositions.map((columnImages, columnIndex) => (
          <div key={columnIndex} className="waterfall-column">
            {columnImages.map((image) => (
              <div key={image.id} className="waterfall-item">
                <img 
                  src={image.src} 
                  alt={`Image ${image.id}`} 
                  loading="lazy" // 原生懒加载
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      {loading && <div className="loading-spinner">Loading...</div>}
    </div>
  )
}

export default Waterfall