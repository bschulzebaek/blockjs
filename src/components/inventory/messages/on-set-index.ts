import ActiveItemPayload from '@/components/inventory/ActiveItemPayload';
import ServiceRegistry from '@/engine/worker/states/ServiceRegistry';

export default function onSetIndex(payload: ActiveItemPayload) {
    ServiceRegistry.getInventoryService().setActiveInventoryItem(payload);
}