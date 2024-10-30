import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
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
import { UserContext } from '../../context/userContext';

const StockManagement = () => {
    const { user }: any = useContext(UserContext);
    const isSeller = user?.role === 'seller';

    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [selectedSeller, setSelectedSeller] = useState<number | null>(null);
    const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
    const [isProductFormVisible, setProductFormVisible] = useState<boolean>(false);
    const [isVariantModalVisible, setIsVariantModalVisible] = useState<boolean>(false)
    const [prevKey, setPrevKey] = useState(0)
    const [criteriaFilter, setCriteriaFilter] = useState(0)
    const [criteriaGroup, setCriteriaGroup] = useState(0)

    const [options, setOptions] = useState<any[]>([{ option: "Vendedor", group: [], groupFunction: () => { } }])

    const showVariantModal = async (product: any) => {
        const group = await getGroupByIdAPI(product.groupId)
        group.product = product
        setSelectedGroup(group)
        setIsVariantModalVisible(true)
    }
    const succesAddVariant = async () => {

        const productsResponse = await getProductsAPI()

        setProducts(productsResponse)
        setFilteredProducts(productsResponse)

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

    const filterBySeller = (product, sellerId) => {
        return sellerId === null || product.id_vendedor === sellerId
    }

    const filterByCategoria = (product, sellerId) => {
        return sellerId === null || product.id_categoria === sellerId
    }

    const filterByGroup = (product, sellerId) => {
        return sellerId === null || product.groupId === sellerId
    }

    const handleSelectSeller = (sellerId: number) => {
        setSelectedSeller(sellerId);
    };

    const filter = () => {

        const filter = options[criteriaFilter].filter
        const newList = products.filter(product =>
            filter(product, selectedSeller)
        )
        setFilteredProducts(newList)  
    }
    // TODO: This updates the inforamtion of the product, but it restores the filters to the default
    // so, try to improve this to mantain the filters
    // const handleSaveSuccess = () => {
    //     fetchData(); 
    //   };
    useEffect(() => {
        filter()

    }, [selectedSeller])

    useEffect(() => {
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

    useEffect(() => { fetchData() }, [])

    useEffect(() => {
        const newOptions = [
            {
                option: 'Categoria',
                filter: filterByCategoria,
                group: categories,
                groupFunction: (category, products) =>
                    products.filter((product) => product.id_categoria == category.id_categoria)
            },
            {
                option: 'Grupo',
                filter: filterByGroup,
                group: groups,
                groupFunction: (group, products) =>
                    products.filter((product) => product.groupId == group.id)
            }
        ];

        if (!isSeller) {
            newOptions.unshift({
                option: 'Vendedor',
                filter: filterBySeller,
                group: sellers,
                groupFunction: (seller, products) => {
                    return products.filter((product) => product.id_vendedor == seller.id_vendedor)
                }
            });
        }

        setOptions(newOptions);
    }, [filteredProducts])

    const handleChangeFilter = (index: number) => {
        setCriteriaFilter(index)
    }

    const handleChangeGroup = (index: number) => {
        setCriteriaGroup(index)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Row gutter={16}> { }
                {!isSeller && (
                    <Col span={8}> { }
                        <h2>Lista de Vendedores</h2>
                        <SellerList filterSelected={criteriaFilter} onSelectSeller={handleSelectSeller} />
                    </Col>
                )}

                <Col span={isSeller ? 24 : 16}> { }
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                        <Select
                            style={{ width: 200, marginRight: 24 }}
                            placeholder="Select an option"
                            onChange={handleChangeFilter}
                            defaultValue={0}
                        >
                            {options.map((option, index) => (
                                <Option key={option.option} value={index}>
                                    {option.option}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            style={{ width: 200, marginLeft: 16, marginRight: 50 }}
                            placeholder="Select an option"
                            onChange={handleChangeGroup}
                            defaultValue={0}
                        >
                            {options.map((option, index) => (
                                <Option key={option.option} value={index}>
                                    {option.option}
                                </Option>
                            ))}
                        </Select>

                        {!isSeller && (
                            <Button onClick={() => setProductFormVisible(true)} type='primary'> Agregar Producto </Button>
                        )}
                    </div>

                    <ProductTable
                        groupList={options[criteriaGroup].group}
                        groupCriteria={options[criteriaGroup].groupFunction}
                        showModal={showModal}
                        showVariantModal={showVariantModal}
                        productsList={isSeller ? products.filter(product => product.id_vendedor === user.id) : filteredProducts}
                        handleUpdate={async () => {
                            const productsResponse = await getProductsAPI();
                            setProducts(productsResponse);
                        }}
                    />
                </Col>
            </Row>

            {infoModalVisible && (
                <ProductInfoModal
                    visible={infoModalVisible}
                    onClose={closeModal}
                    product={selectedProduct}
                    // onSaveSuccess={handleSaveSuccess}
                />
            )}

            {isProductFormVisible && (
                <ProductFormModal
                    visible={isProductFormVisible}
                    onCancel={() => setProductFormVisible(false)}
                    onSuccess={() => {
                        setProductFormVisible(false);
                        setPrevKey(key => key + 1);
                    }}
                />
            )}

            {isVariantModalVisible && (
                <AddVariantModal
                    group={selectedGroup}
                    onAdd={succesAddVariant}
                    onCancel={closeModal}
                    visible={isVariantModalVisible}
                />
            )}
        </div>
    );
};

export default StockManagement;
