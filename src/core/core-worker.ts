import MessagePayload from '@/core/messages/payloads/MessagePayload';
import CoreWorkerMessages from '@/shared/CoreWorkerMessages';
import InputPayload from '@/core/messages/payloads/InputPayload';
import SetupPayload from '@/core/messages/payloads/SetupPayload';
import onInput from '@/core/messages/in/on-input';
import onStart from '@/core/messages/in/on-start';
import onStop from '@/core/messages/in/on-stop';
import onSetup from '@/core/messages/in/on-setup';

import './GlobalState';

onmessage = (event: MessageEvent<MessagePayload>): void => {
    const { action, payload } = event.data;

    switch (action) {
        case CoreWorkerMessages.INPUT_EVENT:
            onInput(payload as InputPayload);
            break;
        case CoreWorkerMessages.START:
            onStart();
            break;
        case CoreWorkerMessages.STOP:
            onStop();
            break;
        case CoreWorkerMessages.SETUP:
            onSetup(payload as SetupPayload);
            break;
        default:
            console.debug(event);
            throw new Error(`Unknown action: ${event.data.action}`);
    }
};