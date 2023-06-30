import styles from '@/app/styles/component/toolbar.module.scss';
import ItemSlot from '@/core/components/inventory/ui/ItemSlot';
import { useContext, useEffect, useState } from 'react';
import InventoryContext from '@/app/(game)/[uuid]/InventoryContext';
import WorkerAdapterContext from '@/app/(game)/[uuid]/WorkerAdapterContext';
import ClientInventory from '@/core/components/inventory/ClientInventory';

export default function Toolbar() {
    const workerAdapter = useContext(WorkerAdapterContext);
    const inventory = useContext(InventoryContext).player as ClientInventory;
    const [activeSlot, setActiveSlot] = useState(inventory.getActiveIndex());

    function onScroll(event: WheelEvent) {
        const { deltaY } = event;
        const dir = deltaY > 0 ? -1 : 1;

        let newSlot: number = activeSlot + dir;

        if (newSlot < 0) {
            newSlot = 8;
        } else if (newSlot > 8) {
            newSlot = 0;
        }

        inventory.setActiveIndex(newSlot, workerAdapter);
        setActiveSlot(newSlot);
    }

    function onKeyDown(event: KeyboardEvent) {
        const index = parseInt(event.key);

        if (isNaN(index) || index === activeSlot) {
            return;
        }

        inventory.setActiveIndex(index, workerAdapter);
        setActiveSlot(index);
    }

    useEffect(() => {
        addEventListener('wheel', onScroll);
        addEventListener('keydown', onKeyDown);

        return () => {
            removeEventListener('wheel', onScroll);
            removeEventListener('keydown', onKeyDown);
        };
    }, [activeSlot]);

    const slots = inventory.getSlots().slice(0, 9).map((item, index) => {
        return (
            <ItemSlot active={activeSlot === index} key={index + '-toolbar'} item={item}/>
        );
    });

    return (
        <div className={styles.toolbar}>
            <div className={styles.quickslots}>
                {slots}
            </div>
        </div>
    );
}