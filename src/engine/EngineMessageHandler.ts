import EngineMessages from '@/engine/worker/EngineMessages';
import onInput from '@/engine/worker/in/on-input';
import onSetup from '@/engine/worker/in/on-setup';
import onStart from '@/engine/worker/in/on-start';
import onStop from '@/engine/worker/in/on-stop';
import onTeardown from '@/engine/worker/in/on-teardown';
import InputPayload from '@/engine/worker/payloads/InputPayload';
import MessagePayload from '@/engine/worker/payloads/MessagePayload';
import SetupPayload from '@/engine/worker/payloads/SetupPayload';

export default class EngineMessageHandler {
    static onMessage(event: MessageEvent<MessagePayload>) {
        const { action, payload } = event.data;

        switch (action) {
            case EngineMessages.INPUT_EVENT:
                onInput(payload as InputPayload);
                break;
            case EngineMessages.START:
                onStart();
                break;
            case EngineMessages.STOP:
                onStop();
                break;
            case EngineMessages.SETUP:
                onSetup(payload as SetupPayload);
                break;
            case EngineMessages.TEARDOWN:
                onTeardown();
                break;
            default:
                console.debug(event);
                throw new Error(`Unknown action: ${event.data.action}`);
        }
    }
}