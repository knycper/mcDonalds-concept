// export default function setObject(itemId, orderId, menu, order, setItem, setSelected) {
//     if (menu) {
//         if (itemId) {
//             const dri = menu.napoje.find(obj => obj.id === itemId)
//             if (dri) {
//                 SetDrink(dri)
//             }
//         } else if (orderId) {
//             const ord = order.find(obj => obj.id === orderId) as DrinkOrder | undefined
//             if (ord) {
//                 const dr = menu.napoje.find(obj => obj.name === ord.name)
//                 if (dr) {
//                     SetDrink(dr)
//                 }
//                 setSelected(ord)
//             }
//         }
//     }
// }