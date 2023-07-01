import styles from '@/app/styles/component/item-slot.module.scss';
import InventorySlot from '@/core/components/inventory/InventorySlot';
import Image from 'next/image';
import { AllHTMLAttributes } from 'react';

function getIconPath(itemId: number): string {
    return `/interface/items/icons/${itemId}.png`;
}

export default function ItemSlot({ active, item, ...rest }: {
    active: boolean,
    item: InventorySlot | null
} & AllHTMLAttributes<HTMLImageElement>) {
    return (
        <div
            className={styles.itemSlot + (active ? ` ${styles.active}` : '')}
            {...rest}
        >
            <div className={styles.inner}>
                <span className={styles.icon}>
                    {item ? <Image
                        src={getIconPath(item.id)}
                        alt={''}
                        width={32}
                        height={32}
                        draggable={false}
                    /> : null
                    }
                </span>

                {/*<span className={styles.quantity}>*/}
                {/*    {item ? item.quantity : null}*/}
                {/*</span>*/}
            </div>
        </div>
    );
}