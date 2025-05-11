import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { onDestroy, tick } from 'svelte';
import { type Readable, readable } from 'svelte/store';


export function useTracker<TType>(handle: () => TType): Readable<TType> {
    return readable(handle(), (set) => {
        const computation = Tracker.autorun(() => {
            set(handle());
        });
        
        onDestroy(() => computation.stop());
    });
}

export function useSubscribe(publication: string, ...params: unknown[]) {
    return useTracker(() => {
        const handle = Meteor.subscribe(publication, ...params);
        const ready = handle.ready();
        console.debug({ publication, handle, ready });
        return ready;
    });
}