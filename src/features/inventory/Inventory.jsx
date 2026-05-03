import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input } from '../../components/common'
import { getAllProducts, deleteProduct } from '../../utils/api'
import { Plus, Trash2, Edit } from 'lucide-react'

export const Inventory = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('inventory.title')}
          </h1>
          <Button
            onClick={() => navigate('/inventory/add')}
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>{t('inventory.addProduct')}</span>
          </Button>
        </div>

        <Card className="mb-6">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </Card>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id}>
                <div className="text-center mb-4">
                  <span className="text-4xl">{product.image}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 text-center">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  {product.category}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                  <p>Price: ${product.price}</p>
                  <p>Stock: {product.count}</p>
                  <p>Type: {product.type}</p>
                  <p>Color: {product.color}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => navigate(`/inventory/edit/${product.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id)}
                    variant="danger"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('common.noData')}</p>
          </Card>
        )}
      </div>
    </Layout>
  )
}
