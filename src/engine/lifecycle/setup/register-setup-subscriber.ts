/**
 * GlobalState is available.
 * ServiceRegistry is not available.
 */
export default async function registerSetupSubscriber() {
    await import('@/framework/feature-flags/SetupSubscriber');
    await import('@/framework/entities/subscriber/TeardownSubscriber');
    await import('@/engine/renderer/SceneReadySubscriber');
    await import('@/components/player/subscriber/SceneReadySubscriber');
}