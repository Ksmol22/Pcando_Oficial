import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, Users, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { products, productCategories, type Product } from '@shared/productDatabase';

export default function AdminPanel() {
  const { user, isAuthenticated, canAccessAdminPanel, getUserDisplayName } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [productList, setProductList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: 0,
    description: '',
    stock: 0,
    warranty: '',
    features: [''],
    specifications: {}
  });

  // Verificar autenticación y permisos
  if (!isAuthenticated || !canAccessAdminPanel()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">No tienes permisos para acceder al panel de administración.</p>
            <Button onClick={() => window.location.href = '/'}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estadísticas del dashboard
  const stats = {
    totalProducts: productList.length,
    totalStock: productList.reduce((sum, product) => sum + product.stock, 0),
    lowStock: productList.filter(product => product.stock < 10).length,
    categories: productCategories.length
  };

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      id: `product-${Date.now()}`,
      ...newProduct,
      currency: 'USD',
      images: [],
      rating: 0,
      reviews: 0,
      compatibility: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProductList([product, ...productList]);
    setNewProduct({
      name: '',
      brand: '',
      category: '',
      subcategory: '',
      price: 0,
      description: '',
      stock: 0,
      warranty: '',
      features: [''],
      specifications: {}
    });
    setIsAddingProduct(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      description: product.description,
      stock: product.stock,
      warranty: product.warranty,
      features: product.features,
      specifications: product.specifications
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProducts = productList.map(product =>
      product.id === editingProduct.id
        ? { ...product, ...newProduct, updatedAt: new Date().toISOString() }
        : product
    );

    setProductList(updatedProducts);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      brand: '',
      category: '',
      subcategory: '',
      price: 0,
      description: '',
      stock: 0,
      warranty: '',
      features: [''],
      specifications: {}
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProductList(productList.filter(product => product.id !== productId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground text-lg">
              Bienvenido, {getUserDisplayName()} - Gestiona inventario, usuarios y configuraciones del sistema
            </p>
          </div>
          <Badge variant="destructive" className="px-3 py-1">
            Admin
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="w-4 h-4 mr-2" />
            Inventario
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stock Total</p>
                    <p className="text-2xl font-bold">{stats.totalStock}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
                  </div>
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categorías</p>
                    <p className="text-2xl font-bold">{stats.categories}</p>
                  </div>
                  <Filter className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productos con stock bajo */}
          <Card>
            <CardHeader>
              <CardTitle>Productos con Stock Bajo (&lt; 10 unidades)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {productList
                  .filter(product => product.stock < 10)
                  .slice(0, 5)
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <Badge variant="destructive">{product.stock} unidades</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventario */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {productCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Marca</label>
                      <Input
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoría</label>
                      <Select 
                        value={newProduct.category} 
                        onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subcategoría</label>
                      <Input
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Precio (USD)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Garantía</label>
                    <Input
                      value={newProduct.warranty}
                      onChange={(e) => setNewProduct({...newProduct, warranty: e.target.value})}
                      placeholder="ej: 3 años"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingProduct ? 'Actualizar' : 'Agregar'} Producto
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                        setNewProduct({
                          name: '', brand: '', category: '', subcategory: '',
                          price: 0, description: '', stock: 0, warranty: '',
                          features: [''], specifications: {}
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-muted-foreground mb-2">{product.brand}</p>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-bold text-primary">${product.price}</span>
                        <Badge variant={product.stock < 10 ? "destructive" : "secondary"}>
                          Stock: {product.stock}
                        </Badge>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Usuarios */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidad de gestión de usuarios en desarrollo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configuraciones del sistema en desarrollo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
