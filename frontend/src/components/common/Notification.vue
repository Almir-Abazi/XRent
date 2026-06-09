<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-80 max-w-[calc(100vw-2.5rem)] pointer-events-none" aria-live="polite">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
        move-class="transition-all duration-300"
      >
        <div
          v-for="n in notificationStore.notifications"
          :key="n.id"
          :class="[
            'flex items-start gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto',
            n.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : '',
            n.type === 'error'   ? 'bg-red-50 border-red-200 text-red-800' : '',
            n.type === 'info'    ? 'bg-blue-50 border-blue-200 text-blue-800' : '',
          ]"
          role="alert"
        >
          <span class="text-lg flex-shrink-0 mt-0.5">
            <template v-if="n.type === 'success'">✓</template>
            <template v-else-if="n.type === 'error'">✕</template>
            <template v-else>ℹ</template>
          </span>
          <span class="flex-1 text-sm leading-relaxed">{{ n.message }}</span>
          <button
            @click="notificationStore.remove(n.id)"
            class="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity text-base leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotificationStore } from '../../stores/notification'

const notificationStore = useNotificationStore()
</script>
