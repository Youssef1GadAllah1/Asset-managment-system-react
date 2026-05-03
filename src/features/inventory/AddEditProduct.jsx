import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input, Select } from '../../components/common'
import { createProduct, updateProduct, getProductById } from '../../utils/api'

export const AddEditProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cosmetics',
    description: '',
    price: '',
    quantity: '',
    reorder_level: '',
    supplier: '',
    sku: '',
    image: '💄',
    status: 'active'
  })
  const [loading, setLoading] = useState(id ? true : false)

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const data = await getProductById(id)
      setFormData(data)
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Cosmetics', 'Skincare', 'Fragrances', 'Hair Care', 'Other']

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorder_level)
      }
      
      if (id) {
        await updateProduct(id, submitData)
      } else {
        await createProduct(submitData)
      }

      navigate('/inventory')
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {id ? t('inventory.editProduct') : t('inventory.addProduct')}
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('inventory.productName')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                badge="Product Type"
                icon="🏷️"
                options={categories.map(cat => ({ id: cat, label: cat }))}
              />

              <Input
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 h-20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Reorder Level"
                name="reorder_level"
                type="number"
                value={formData.reorder_level}
                onChange={handleChange}
              />
              <Input
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
              />
            </div>

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              badge="Product Status"
              icon="✓"
              options={[
                { id: 'active', label: '✓ Active' },
                { id: 'inactive', label: '✗ Inactive' }
              ]}
            />

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1">
                {id ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/inventory')}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}
