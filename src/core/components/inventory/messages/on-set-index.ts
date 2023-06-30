import ActiveItemPayload from '@/core/components/inventory/ActiveItemPayload';
import GlobalState from '@/core/GlobalState';
import Player from '@/core/components/player/Player';

export default function onSetIndex(payload: ActiveItemPayload) {
    const player = GlobalState.getScene().getObjectByName('player') as Player;
    const inventory = player.getInventory();

    inventory.setActiveIndex(payload.index);
}