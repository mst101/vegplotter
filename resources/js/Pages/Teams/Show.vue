<script setup lang="ts">
import type { JetstreamTeamPermissions, Role, Team, TeamInvitation, User, UserMembership } from '@/types';
import SectionBorder from '@/Components/SectionBorder.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageContainer from '@/Pages/PageContainer.vue';
import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm.vue';
import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager.vue';
import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm.vue';

defineOptions({
    layout: AppLayout,
});

defineProps<{
    team: Team & {
        owner: User;
        team_invitations: TeamInvitation[];
        users: UserMembership[];
    };
    availableRoles: Role[];
    permissions: JetstreamTeamPermissions;
}>();
</script>

<template>
    <PageContainer title="Team Settings">
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Team Settings
            </h2>
        </template>

        <div>
            <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
                <UpdateTeamNameForm :team="team" :permissions="permissions" />

                <TeamMemberManager
                    class="mt-10 sm:mt-0"
                    :team="team"
                    :available-roles="availableRoles"
                    :user-permissions="permissions"
                />

                <template v-if="permissions.canDeleteTeam && !team.personal_team">
                    <SectionBorder />

                    <DeleteTeamForm class="mt-10 sm:mt-0" :team="team" />
                </template>
            </div>
        </div>
    </PageContainer>
</template>
