<template>
  <div class="p-4">
    <table class="w-full border-collapse">
      <tbody>
        <tr v-for="(value, key) in user" :key="key" class="border-b">
          <td class="py-2 px-4 font-bold w-1/3">{{ key }}</td>
          <td class="py-2 px-4 w-2/3">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { UserWithoutPassword } from "~/types";

defineProps<{ user: UserWithoutPassword | null }>();
</script>