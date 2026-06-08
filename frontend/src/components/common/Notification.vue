<template>
  <Teleport to="body">
    <div class="notification-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="n in notificationStore.notifications"
          :key="n.id"
          :class="['toast', `toast--${n.type}`]"
          role="alert"
        >
          <span class="toast-icon">{{ icons[n.type] }}</span>
          <span class="toast-message">{{ n.message }}</span>
          <button
            class="toast-close"
            @click="notificationStore.remove(n.id)"
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

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}
</script>

<style>
.notification-container {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 360px;
  max-width: calc(100vw - 2.5rem);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 6px;
  border-left: 4px solid transparent;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  pointer-events: all;
  font-size: 0.95rem;
  line-height: 1.4;
}

.toast--success {
  background-color: #f1f8e9;
  border-left-color: #43a047;
  color: #2e7d32;
}

.toast--error {
  background-color: #ffebee;
  border-left-color: #d32f2f;
  color: #b71c1c;
}

.toast--info {
  background-color: #e3f2fd;
  border-left-color: #1976d2;
  color: #0d47a1;
}

.toast-icon {
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0;
  flex-shrink: 0;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

/* Slide-in from right */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.28s ease;
}

.toast-enter-from {
  transform: translateX(110%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(110%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.28s ease;
}
</style>
