import React, { useEffect, useState } from 'react';
import SellerList from './SellerList';
import ProductTable from './ProductTable';
import { addProductFeaturesAPI, getProductsAPI, registerVariantAPI, updateProductStockAPI } from '../../api/product'; // Assuming this is where you get both sellers and products
import { Button, Input, Select } from 'antd';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProductInfoModal from '../Product/ProductInfoModal';
import ProductFormModal from '../Product/ProductFormModal';
import AddVariantModal from '../Product/AddVariantModal';
import { Option } from 'antd/es/mentions';
import { getGroupByIdAPI, getGroupsAPI } from '../../api/group';
import { getSellersAPI } from '../../api/seller';
import { getCategoriesAPI } from '../../api/category';
import ConfirmProductsModal from './ConfirmProductsModal';

const StockManagement = () => {
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [selectedSeller, setSelectedSeller] = useState<number | null>(null);
    const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
    const [isProductFormVisible, setProductFormVisible] = useState<boolean>(false);
    const [isVariantModalVisible, setIsVariantModalVisible] = useState<boolean> (false)
    const [prevKey, setPrevKey] = useState(0)
    const [criteriaFilter, setCriteriaFilter] = useState(0)
    const [criteriaGroup, setCriteriaGroup] = useState(0)

    const [options, setOptions] = useState<any[]>([{option: "Vendedor",group: [], groupFunction: () => {}}])

    const [productsToUpdate, setProductsToUpdate] = useState<{ [key: number]: number }>({})
    const [stock, setStock] = useState([])
    const [newProducts, setNewProducts] = useState<any[]>([])
    const [newVariants, setNewVariants] = useState<any[]>([])
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

    const showVariantModal = async (product: any) => {
        const group = await getGroupByIdAPI(product.groupId)
        group.product = product
        setSelectedGroup(group)
        setIsVariantModalVisible(true)
    }

    const closeConfirmProduct = async () => {

        
        const productsResponse = await getProductsAPI()
        
        setProducts(productsResponse)
        setFilteredProducts(productsResponse)

        setNewVariants([])
        setProductsToUpdate({})
        setNewProducts([])
        setStock([])
        setIsConfirmModalVisible(false)
    }

    const cancelConfirmProduct = async () => {
        setIsConfirmModalVisible(false)
    }

    const succesAddVariant = async (newVariant) => {

        setProducts([...products, newVariant.product])
        setFilteredProducts([...filteredProducts, newVariant.product])

        setNewVariants([...newVariants, newVariant])

        closeModal()
    }

    const showModal = (product: any) => {
        setSelectedProduct(product)
        setInfoModalVisible(true)
    }

    const closeModal = () => {
        setSelectedProduct(null)
        setInfoModalVisible(false)

        setSelectedGroup(null)
        setIsVariantModalVisible(false)
    }
    
    const filterBySeller =  (product, sellerId) => {
        return sellerId === null || product.id_vendedor === sellerId
    }

    const filterByCategoria = (product, sellerId) => {
        return sellerId === null || product.id_categoria === sellerId
    }

    const filterByGroup =  (product, sellerId) => {
        return sellerId === null || product.groupId === sellerId
    }

    const handleSelectSeller =  (sellerId: number) => {
        setSelectedSeller(sellerId);
    };

    const filter =  () => {
        
        const filter = options[criteriaFilter].filter
        const newList = products.filter(product => 
            filter(product, selectedSeller)
        )
        console.log(selectedSeller)
        setFilteredProducts(newList)  
    }

    useEffect(() => {
        filter()
        
    }, [selectedSeller])

    useEffect( () => {
        fetchData()
    }, [prevKey])

    const [products, setProducts] = useState<any[]>([])
    const [sellers, setSellers] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [groups, setGroups] = useState<any[]>([])

    const fetchData = async () => {
        const sellersResponse = await getSellersAPI()
        const categoriesResponse = await getCategoriesAPI()
        const groupsResponse = await getGroupsAPI()
        const productsResponse = await getProductsAPI()

        setSellers(sellersResponse)
        setCategories(categoriesResponse)
        setGroups(groupsResponse)
        setProducts(productsResponse)
        setFilteredProducts(productsResponse)
    
       
    }

    useEffect(() => {fetchData()}, [])

    useEffect(() => {
        setOptions([
            {
                option: 'Vendedor',
                filter: filterBySeller,
                group: sellers,
                groupFunction: (seller, products) => {
                    const agrouped = products.filter((product) => product.id_vendedor == seller.id_vendedor)
                    return agrouped
                }
            }, {
                option: 'Categoria',
                filter: filterByCategoria,
                group: categories,
                groupFunction: (category, products) => 
                    products.filter((product) => product.id_categoria == category.id_categoria)
    
            }, {
                option: 'Grupo',
                filter: filterByGroup,
                group: groups,
                groupFunction: (group, products) => 
                    products.filter((product) => product.groupId == group.id)
    
            }
        ])
    }, [filteredProducts])

    const handleChangeFilter = (index: number) => {
        setCriteriaFilter(index)
    }

    const handleChangeGroup = (index: number) => {
        setCriteriaGroup(index)
    }

    const saveNewProducts = (productData, combinations, selectedFeatures, features) => {
        setProductFormVisible(false)
        setNewProducts([...newProducts, {
            productData,
            combinations,
            selectedFeatures,
            features
        }])
        setPrevKey(key => key+1)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '25%' }}>
                    <h2>Lista de Vendedores</h2>
                    <SellerList
                        filterSelected={criteriaFilter}
                        onSelectSeller={handleSelectSeller}
                    />
                </div>
                <div style={{ width: '75%' }}>
                    {/* <h2>Productos</h2> */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Select style={{ width: 200, marginRight: 24 }} placeholder="Select an option"
                            onChange={handleChangeFilter}
                            defaultValue={0}
                        >
                            {options.map((option, index) => (
                            <Option key={option.option} value={index}>
                                {option.option}
                            </Option>
                            ))}
                        </Select>

                        <Select style={{ width: 200, marginLeft: 16, marginRight: 50 }} placeholder="Select an option"
                            onChange={handleChangeGroup}
                            defaultValue={0}
                        >
                            {options.map((option, index) => (
                            <Option key={option.option} value={index}>
                                {option.option}
                            </Option>
                            ))}
                        </Select>
                        
                        <Button onClick={() => setProductFormVisible(true)} type='primary'>Agregar Producto</Button>
                            
                        <Button 
                            style={{ marginLeft: '20px' }}
                            onClick={() => {
                                const newStock = []
                                for(const productId in productsToUpdate){
                                    const product = products.find((product) => product.id_producto == productId)
                                    
                                    if(product.producto_sucursal[0]){
                                        product.producto_sucursal[0].cantidad_por_sucursal += productsToUpdate[productId]
                                        product.entrance = productsToUpdate[productId]
                                    }

                                    newStock.push({
                                        product,
                                        newStock: {
                                            productId,
                                            sucursalId: 3,
                                            stock: productsToUpdate[productId]
                                        }
                                    })
                                }
                                setStock(newStock)
                                setIsConfirmModalVisible(true)}
                            }>
                            Actualizar Stock
                        </Button>
                    </div>
                    
                    <ProductTable
                        groupList = {options[criteriaGroup].group}
                        groupCriteria = {options[criteriaGroup].groupFunction}
                        showModal = {showModal}
                        showVariantModal = {showVariantModal}
                        productsList = {filteredProducts}
                        handleUpdate = { (ingresoData: { [key: number]: number }) =>{
                            setProductsToUpdate(ingresoData)
                        } }
                    />
                    
                </div>
            </div>

            {infoModalVisible && 
                <ProductInfoModal
                    visible={infoModalVisible}
                    onClose={closeModal}
                    product={selectedProduct}
                />
            }

            {isProductFormVisible && 
                <ProductFormModal
                    visible={isProductFormVisible}
                    onCancel={() => setProductFormVisible(false)}
                    onSuccess={saveNewProducts}
                />
            }

            { isVariantModalVisible &&
                <AddVariantModal
                    group={selectedGroup}
                    onAdd={succesAddVariant}
                    onCancel={closeModal}
                    visible={isVariantModalVisible}
                />
            }
            {
                isConfirmModalVisible && 
                <ConfirmProductsModal
                    visible={isConfirmModalVisible}
                    onClose={cancelConfirmProduct}
                    onSuccess={() => closeConfirmProduct()}
                    newVariants = {newVariants}
                    newProducts = {newProducts}
                    newStock = {stock}
                />
            }
        </div>
    );
};

export default StockManagement;
