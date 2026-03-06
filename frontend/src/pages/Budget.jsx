import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import BudgetAnalysis from '../components/analytics/BudgetAnalysis';

export default function Budget() {
    return (
        <DashboardLayout>
            <BudgetAnalysis />
        </DashboardLayout>
    );
}
