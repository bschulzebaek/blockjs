import { Context, createContext, Dispatch, SetStateAction } from 'react';
import ClientInventory from '@/core/components/inventory/ClientInventory';
import { InventoryObject } from '@/core/components/inventory/InventoryRepository';

// @ts-ignore
const InventoryContext: Context<any> = createContext(null);

function onReceiveInventory(inventories: InventoryObject[], state: any, setter: Dispatch<SetStateAction<any>>) {
    inventories.forEach((inventory) => {
        state[inventory.id] = new ClientInventory(inventory);
    });

    setter(state);
}

export {
    InventoryContext as default,
    onReceiveInventory,
};