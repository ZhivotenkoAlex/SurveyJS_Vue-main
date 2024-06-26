<template>
    <h1>`{{ surveyName }}` results</h1>
    <div class="sjs-results-content" ref="visContainerRef">
        <div class="sjs-results-placeholder">
            <span>This survey doesn't have any answers yet</span>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Model } from 'survey-core';
import 'tabulator-tables/dist/css/tabulator.css';
import 'survey-analytics/survey.analytics.tabulator.css';
import { Tabulator } from 'survey-analytics/survey.analytics.tabulator';
import { getResults, getSurvey } from '../models/survey';
import { useRoute } from 'vue-router'; // Import useRoute hook

export default {
    name: 'Viewer',
    setup() {
        const visContainerRef = ref(null);
        const surveyName = ref('');
        const route = useRoute(); // Use useRoute hook to access route information
        onMounted(async () => {
            const survey = await getSurvey(route.params.id);
            surveyName.value = survey.name
            const result = await getResults(route.params.id);
            if (result.length > 0) {
                const model = new Model(survey.json);
                visContainerRef.value.innerHTML = '';

                const surveyAnalyticsTabulator = new Tabulator(
                    model,
                    result.map((item) => (typeof item === 'string' ? JSON.parse(item) : item))
                );

                surveyAnalyticsTabulator.render(visContainerRef.value);
            }
        });

        return {
            visContainerRef,
            surveyName
        };
    },
};
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>