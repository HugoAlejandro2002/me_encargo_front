export const paySellerDebts = (seller: any, setRefreshKey: any) => {
    seller.deuda = 'Bs. 0' 
    console.log(seller)
    setRefreshKey((prev: number) => prev + 1)
}