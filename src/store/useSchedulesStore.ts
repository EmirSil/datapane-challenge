import { defineStore } from 'pinia';

import Schedule from '../interfaces/Schedule';
import CronParser from 'cron-parser';

export const useSchedulesStore = defineStore('schedules', {
  state: () => ({
    schedules: [
      { id: 0, cron: '15 15 10 10 *', description: 'Instantiate the store' },
      { id: 1, cron: '15 15 9 9 *', description: 'Continue the store' },
      { id: 2, cron: '15 15 8 8 *', description: 'Finish the store' },
    ],
  }),
  getters: {
    sortedReadableSchedules: function (state) {
      let readableSchedules: Schedule[] = [];
      for (let i = 0; i < state.schedules.length; i++) {
        let tempSchedule = JSON.parse(JSON.stringify(state.schedules[i]));
        const parser = CronParser.parseExpression(tempSchedule.cron);
        const nextDate = parser.next().toString();
        const dateObj = new Date(nextDate);
        tempSchedule.cron = dateObj;
        readableSchedules.push(tempSchedule);
      }
      return readableSchedules.sort(
        (objA, objB) => Number(objA.cron) - Number(objB.cron),
      );
    },
  },
  actions: {
    addSchedule(schedule: Schedule) {
      this.schedules.push(schedule);
    },
  },
});
