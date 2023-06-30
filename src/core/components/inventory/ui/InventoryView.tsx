import styles from '@/app/styles/component/inventory.module.scss';
import { useContext, useState } from 'react';
import InventoryContext from '@/app/(game)/[uuid]/InventoryContext';
import ItemSlot from '@/core/components/inventory/ui/ItemSlot';
import WorkerAdapterContext from '@/app/(game)/[uuid]/WorkerAdapterContext';
import ClientInventory from '@/core/components/inventory/ClientInventory';

export default function InventoryView() {
    const adapter = useContext(WorkerAdapterContext);
    const inventory = useContext(InventoryContext).player as ClientInventory;
    const slots = inventory.getSlots();
    const activeIndex = inventory.getActiveIndex();
    const [draggedItem, setDraggedItem] = useState(-1);

    function onDragStart(index: number) {
        setDraggedItem(index);
    }

    function onDragEnd(event: DragEvent) {
        event.preventDefault();
        setDraggedItem(-1);
    }

    function onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    function onDrop(index: number) {
        inventory.swapPosition(draggedItem, index, adapter);
        setDraggedItem(-1);
    }

    const grid = slots.slice(9).map((item, index) => {
        return (
            <ItemSlot
                active={false}
                key={index + '-grid'}
                item={item}
                draggable={true}
                onDragStart={() => onDragStart(index + 9)}
                /*
                // @ts-ignore */
                onDragEnd={onDragEnd}
                /*
                // @ts-ignore */
                onDragOver={onDragOver}
                onDrop={() => onDrop(index + 9)}
            />
        );
    });

    const toolbar = slots.slice(0, 9).map((item, index) => {
        return (
            <ItemSlot
                active={activeIndex === index}
                key={index + '-toolbar'}
                item={item}
                draggable={true}
                onDragStart={() => onDragStart(index)}
                /*
                // @ts-ignore */
                onDragEnd={onDragEnd}
                /*
                // @ts-ignore */
                onDragOver={onDragOver}
                onDrop={() => onDrop(index)}
            />
        );
    });

    return (
        <>
            <div className={'backdrop backdrop-7'}></div>
            <div className={'center-absolute ' + styles.container}>
                <div className="label">Inventory</div>
                <div className={styles.craftingArea}>

                </div>
                <div className={styles.itemGrid}>
                    {grid}
                </div>
                <div className={styles.itemToolbar}>
                    {toolbar}
                </div>
            </div>
        </>
    );
}