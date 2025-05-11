<script lang="ts">
  import { RuntimeCollection } from '/imports/api/runtime';
  import { useSubscribe, useTracker } from '/lib/MeteorSvelte.svelte';
  import { Meteor } from "meteor/meteor";
  import { LinksCollection } from '../api/links';

  let myClickCount = 0;
  const addToCounter = () => {
    myClickCount += 1;
    Meteor.call('runtime.click', (error, response) => {
        console.log('Click method call completed!', { error, response })
        if (error) {
            alert(error.message);
        }
    })
  }

  const links = useTracker(() => LinksCollection.find({}).fetch());
  const clicks = useTracker(() => RuntimeCollection.findOne({ _id: 'clicks' }))
  const serverTime = useTracker(() => RuntimeCollection.findOne({ _id: 'time' }));
  const linksReady = useSubscribe('links.all');
  const runtimeReady = useSubscribe('runtime');

  const reverseTitle = (linkId) => {
    Meteor.call('links.reverse-title', linkId)
  }
</script>


<div class="container">
  <h1>Welcome to Meteor!</h1>
  <h3>The current server time is {$serverTime?.value}</h3>

  <button on:click={addToCounter}>Click Me</button>
  <p>
    You've pressed the button {myClickCount} times. In total, it has been clicked
    <span>
      {#if !$runtimeReady}
        (loading...)
      {:else}
        {$clicks?.value.toLocaleString() || 0}
      {/if}
    </span>
    times.
  </p>

  <h2>Learn Meteor!</h2>
  {#if !$linksReady}
    <div>Waiting on links...</div>
  {:else}
    <ul>
      {#each $links as link (link._id)}
        <li>
          <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
          <button on:click={() => { reverseTitle(link._id) }}>Reverse</button>
        </li>
      {/each}
    </ul>
  {/if}

  <h2>Typescript ready</h2>
  <p>Just add lang="ts" to .svelte components.</p>
</div>
