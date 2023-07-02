/**
 * GlobalState is available.
 * ServiceRegistry is available.
 */
export default async function registerSubscriber() {
    await import('@/components/inventory/subscriber/InventoryUpdateSubscriber');
    await import('@/components/inventory/subscriber/InventorySwapSubscriber');
    await import('@/framework/world/subscriber/UpdateGridSubscriber');
    await import('@/framework/world/chunk/subscriber/SetBlockSubscriber');
}