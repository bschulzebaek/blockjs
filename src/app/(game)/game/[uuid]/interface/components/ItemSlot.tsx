import styles from '@/styles/component/item-slot.module.scss';

export default function ItemSlot({ active }: { active: boolean }) {
    return (
        <div className={styles.itemSlot + (active ? ` ${styles.active}` : '')}>
            <div className={styles.inner}>
                <span className={styles.icon}>
                    todo
                </span>

                <span className={styles.quantity}>
                    32
                </span>
            </div>
        </div>
    );
}