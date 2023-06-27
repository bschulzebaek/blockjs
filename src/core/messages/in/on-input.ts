import InputPayload from '@/core/messages/payloads/InputPayload';
import InputMapper from '@/core/engine/helper/InputMapper';

export default function onInput(payload: InputPayload) {
    InputMapper.dispatch(payload);
}