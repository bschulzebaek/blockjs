import InputPayload from '@/engine/worker/payloads/InputPayload';
import InputMapper from '@/engine/worker/utility/InputMapper';

export default function onInput(payload: InputPayload) {
    InputMapper.dispatch(payload);
}