import styles from '@/app/styles/component/toolbar.module.scss';
import ItemSlot from '@/app/(game)/[uuid]/interface/components/ItemSlot';
import { useEffect, useState } from 'react';

export default function Toolbar() {
    const [activeSlot, setActiveSlot] = useState(0);

    let children = [];

    for (let i = 0; i < 9; i++) {
        children.push(<ItemSlot key={i} active={i === activeSlot} />);
    }

    function onScroll(event: WheelEvent) {
        const { deltaY } = event;
        const dir = deltaY > 0 ? -1 : 1;

        let newSlot = activeSlot + dir;

        if (newSlot < 0) {
            newSlot = 8;
        } else if (newSlot > 8) {
            newSlot = 0;
        }

        setActiveSlot(newSlot);
    }

    useEffect(() => {
        addEventListener('wheel', onScroll);

        return () => {
            removeEventListener('wheel', onScroll);
        }
    }, [activeSlot]);

    return (
        <div className={styles.toolbar}>
            <div className={styles.quickslots}>
                {children}
            </div>
        </div>
    )
}