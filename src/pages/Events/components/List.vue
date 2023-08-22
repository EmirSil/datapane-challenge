<script setup lang="ts">
import { useSchedulesStore } from "../../../store/useSchedulesStore";
import { storeToRefs } from "pinia";
const schedulesStore = useSchedulesStore();

const { sortedReadableSchedules } = storeToRefs(schedulesStore);

function readable(dateObj: Date) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1 < 10 ? "0" + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
    const day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
    const hour = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
    const min = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
    return `${day}/${month}/${year} ${hour}:${min}:00`;
}

</script>
<template>
    <h2
        class="schedules-title mb-8 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight my-4">
        Upcoming Schedules
    </h2>
    <ul class="max-w flex flex-col">
        <li v-for="schedule in sortedReadableSchedules" :key="schedule.id" class="
        inline-flex 
        items-center 
        gap-x-2 
        py-8 
        pr-4 
        pl-8
        bg-white border
        -mt-px first:rounded-t-lg 
        first:mt-0 
        odd:bg-blue-100
        my-2
        last:rounded-b-lg">
            <div class="text-sm font-medium text-gray-800 mr-16"> {{ readable(schedule.cron) }} </div>
            <div class=""> {{ schedule.description }} </div>
        </li>
    </ul>
</template>
<style scoped>
.schedules-title {
    overflow: visible;
}
</style>