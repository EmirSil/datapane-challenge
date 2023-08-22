<script setup lang="ts">
import { ref, computed } from "vue";
import { useSchedulesStore } from "../../../store/useSchedulesStore";
import { storeToRefs } from "pinia";
import Schedule from "../../../interfaces/Schedule";
const schedulesStore = useSchedulesStore();

const cronInput = ref("");
const showSuccessAlert = ref(false);
const description = ref("");
const hasCronError = ref(false);
const hasDescriptionError = ref(false);
const selectedMonth = ref(1);
const selectedDay = ref(null);
const selectedHour = ref(null);
const selectedMinute = ref(null);
const errorMessage = ref("");
const months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const schedules = schedulesStore.schedules;
const showInput = ref(false);
const showHumanReadableInput = ref(false);
const humanReadableInput = computed(() => `${selectedMinute.value} ${selectedHour.value} ${selectedDay.value} ${selectedMonth.value} *`)

function isPositiveInteger(string: string): boolean {
    const number = Number(string);
    const isInteger = Number.isInteger(number);
    const isPositive = number > 0;

    return isInteger && isPositive;
}

function isValidDate(year: number, month: number, day: number) {
    var d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return true;
    }
    return false;
}

function cronIsValid() {
    hasCronError.value = false;
    hasDescriptionError.value = false;
    errorMessage.value = "";

    let splittedCron: string[] = showHumanReadableInput.value ? humanReadableInput.value.split(" ") : cronInput.value.split(" ");

    if (splittedCron.length !== 5) {
        hasCronError.value = true;
        errorMessage.value = "Invalid cron expression";
        return;
    }

    if (splittedCron[4] !== "*") {
        hasCronError.value = true;
        errorMessage.value = "Please use only date and time for setting an event";
        return;
    }

    let minute: string = splittedCron[0];
    let hour: string = splittedCron[1];
    let day: string = splittedCron[2];
    let month: string = splittedCron[3];

    if (!isPositiveInteger(minute) || Number(minute) > 59) {
        hasCronError.value = true;
        errorMessage.value = "Please use valid minutes";
        return;
    }
    if (!isPositiveInteger(hour) || Number(hour) > 23) {
        hasCronError.value = true;
        errorMessage.value = "Please use valid hours";
        return;
    }
    if (!isPositiveInteger(day) || Number(day) > 31) {
        hasCronError.value = true;
        errorMessage.value = "Please use valid day";
        return;
    }
    if ((!isPositiveInteger(month) || Number(month) - 1 > 11) && months.indexOf(month.toUpperCase()) === -1) {
        hasCronError.value = true;
        errorMessage.value = "Please use valid month";
        return;
    }
    if (!isValidDate(2021, Number(month) - 1, Number(day))) {
        hasCronError.value = true;
        errorMessage.value = "Please use valid date, avoid the 29th of February please";
        return;
    }
    return true;
}

function descriptionIsValid() {
    let valid: boolean = description.value.length !== 0;
    hasCronError.value = false;
    hasDescriptionError.value = false;
    errorMessage.value = "";
    if (!valid) {
        hasDescriptionError.value = true;
        errorMessage.value = "Please use valid date, avoid the 29th of February please";
        return false;
    }
    return true;
}

function onSubmit() {
    if (cronIsValid() && descriptionIsValid()) {
        hasCronError.value = false;
        hasDescriptionError.value = false;
        errorMessage.value = "";
        const schedule = {
            id: Math.floor(Math.random() * 10000),
            cron: showHumanReadableInput.value ? humanReadableInput.value : cronInput.value,
            description: description.value,
        };
        showSuccessAlert.value = true;
        setTimeout(() => {
            showSuccessAlert.value = false;
        }, 3000);
        schedulesStore.addSchedule(schedule);
        cronInput.value = "";
        description.value = "";
    }
    return;
}
function onShowInput() {
    hasDescriptionError.value = false;
    showHumanReadableInput.value = false;
    hasCronError.value = false;
    errorMessage.value = ""
    showInput.value = !showInput.value;
}
</script>
<template>
    <Transition>

        <div v-if="showSuccessAlert"
            class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md absolute bottom-0 left-0"
            role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path
                            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg></div>
                <div>
                    <p class="font-bold">Schedule succesfully added!</p>
                </div>
            </div>
        </div>
    </Transition>
    <button title="Contact Sale" @click="onShowInput()"
        class="fixed pb-2 z-90 bottom-10 right-8 bg-blue-600 w-16 h-16 rounded-full drop-shadow-lg flex 
    justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl duration-300">&#43;</button>
    <Transition>
        <div v-if="showInput" class="bg-white h-68 w-80 py-4 px-4 absolute z-90 bottom-10 
    right-8 h-20 rounded-lg drop-shadow-lg justify-center 
    items-center text-black hover:drop-shadow-2xl duration-300">
            <div class="h-auto">
                <div class="mb-4">
                    <label for="error" class="block mb-2 text-sm font-medium" v-if="!showHumanReadableInput">CRON
                        input</label>
                    <label for="error" class="block mb-2 text-sm font-medium" v-else>Date input</label>
                    <input v-if="!showHumanReadableInput" @keyup.enter="onSubmit" v-model="cronInput" type="text" id="error"
                        class="border text-sm rounded-lg dark:bg-gray-700 block w-full p-2.5" placeholder="* * * * *">
                    <div v-else @keyup.enter="onSubmit"
                        class="flex items-baseline text-sm rounded-lg dark:bg-gray-700 block w-full p-2.5">
                        <select id="countries" v-model="selectedMonth"
                            class="bg-gray-50 text-gray-900 text-sm rounded-lg block outline-0 w-20 p-2.5">
                            <option v-for="(month, $index) in months" :key="month" :value="$index + 1">{{ month }}
                            </option>
                        </select>
                        <input type="text" class="w-8 ml-2 outline-0" v-model="selectedDay" placeholder="Day">
                        <input type="text" class="w-8 ml-6 mr-2 outline-0" v-model="selectedHour" placeholder="Hour">
                        <span>:</span>
                        <input type="text" class="w-12 ml-2 outline-0" v-model="selectedMinute" placeHolder="Minute">
                    </div>
                    <p v-if="hasCronError" class="mt-2 text-sm text-red-600">
                        <span class="font-medium">{{ errorMessage }}</span>
                    </p>
                    <span class="mt-2 text-sm float-right hover:underline cursor-pointer"
                        @click="showHumanReadableInput = !showHumanReadableInput">
                        <span class="font-medium">Switch Input</span>
                    </span>
                </div>
                <div class="mb-4">
                    <label for="error" class="block mb-2 text-sm font-medium">Description</label>
                    <input @keyup.enter="onSubmit" v-model="description" type="text" id="error"
                        class="border text-sm rounded-lg block w-full p-2.5"
                        placeholder="Triggering an automated report generation event">
                    <p v-if="hasDescriptionError" class="mt-2 text-sm text-red-600">
                        <span class="font-medium">{{ errorMessage }}</span>
                    </p>
                </div>
                <div class="flex justify-end">
                    <button @click="showInput = !showInput"
                        class="bg-transparent hover:bg-grey-500 text-grey-700 font-semibold py-2 px-4 border border-grey-500 rounded">
                        Cancel
                    </button>
                    <button class="ml-2 bg-green-500 text-white font-bold py-2 px-4 rounded" @click="onSubmit">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>