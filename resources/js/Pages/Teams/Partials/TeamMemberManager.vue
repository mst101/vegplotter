<script setup lang="ts">
import type { JetstreamTeamPermissions, Nullable, Role, Team, TeamInvitation, UserMembership } from '@/types';
import ActionMessage from '@/Components/ActionMessage.vue';
import ActionSection from '@/Components/ActionSection.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import DangerButton from '@/Components/DangerButton.vue';
import DialogModal from '@/Components/DialogModal.vue';
import FormSection from '@/Components/FormSection.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import SectionBorder from '@/Components/SectionBorder.vue';
import TextInput from '@/Components/TextInput.vue';
import { router, useForm, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps<{
    team: Team & {
        team_invitations: TeamInvitation[];
        users: UserMembership[];
    };
    availableRoles: Role[];
    userPermissions: JetstreamTeamPermissions;
}>();

const page = usePage();

const addTeamMemberForm = useForm({
    email: '',
    role: null as Nullable<string>,
});

const updateRoleForm = useForm({
    role: null as Nullable<string>,
});

const leaveTeamForm = useForm({});
const removeTeamMemberForm = useForm({});

const currentlyManagingRole = ref(false);
const managingRoleFor = ref<Nullable<UserMembership>>(null);
const confirmingLeavingTeam = ref(false);
const teamMemberBeingRemoved = ref<Nullable<UserMembership>>(null);

function addTeamMember() {
    addTeamMemberForm.post(route('team-members.store', [props.team]), {
        errorBag: 'addTeamMember',
        preserveScroll: true,
        onSuccess: () => addTeamMemberForm.reset(),
    });
}

function cancelTeamInvitation(invitation: TeamInvitation) {
    router.delete(route('team-invitations.destroy', [invitation]), {
        preserveScroll: true,
    });
}

function manageRole(teamMember: UserMembership) {
    managingRoleFor.value = teamMember;
    updateRoleForm.role = teamMember.membership.role;
    currentlyManagingRole.value = true;
}

function updateRole() {
    updateRoleForm.put(route('team-members.update', [props.team, managingRoleFor.value]), {
        preserveScroll: true,
        onSuccess: () => currentlyManagingRole.value = false,
    });
}

function confirmLeavingTeam() {
    confirmingLeavingTeam.value = true;
}

function leaveTeam() {
    leaveTeamForm.delete(route('team-members.destroy', [props.team, page.props.auth.user]));
}

function confirmTeamMemberRemoval(teamMember: UserMembership) {
    teamMemberBeingRemoved.value = teamMember;
}

function removeTeamMember() {
    removeTeamMemberForm.delete(route('team-members.destroy', [props.team, teamMemberBeingRemoved.value]), {
        errorBag: 'removeTeamMember',
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => teamMemberBeingRemoved.value = null,
    });
}

function displayableRole(role: string) {
    return props.availableRoles.find(r => r.key === role)?.name;
}
</script>

<template>
    <div>
        <div v-if="userPermissions.canAddTeamMembers">
            <SectionBorder />

            <!-- Add Team Member -->
            <FormSection @submitted="addTeamMember">
                <template #title>
                    Add Team Member
                </template>

                <template #description>
                    Add a new team member to your team, allowing them to collaborate with you.
                </template>

                <template #form>
                    <div class="col-span-6">
                        <div class="max-w-xl text-sm text-gray-600">
                            Please provide the email address of the person you would like to add to this team.
                        </div>
                    </div>

                    <!-- Member Email -->
                    <div class="col-span-6 sm:col-span-4">
                        <InputLabel for="email" value="Email" />
                        <TextInput
                            id="email"
                            v-model="addTeamMemberForm.email"
                            type="email"
                            class="mt-1 block w-full"
                        />
                        <InputError v-if="addTeamMemberForm.errors?.email" :message="addTeamMemberForm.errors.email" class="mt-2" />
                    </div>

                    <!-- Role -->
                    <div v-if="availableRoles.length > 0" class="col-span-6 lg:col-span-4">
                        <InputLabel for="roles" value="Role" />
                        <InputError v-if="addTeamMemberForm.errors?.role" :message="addTeamMemberForm.errors.role" class="mt-2" />

                        <div class="relative z-0 mt-1 cursor-pointer rounded-lg border border-gray-200">
                            <button
                                v-for="(role, i) in availableRoles"
                                :key="role.key"
                                type="button"
                                class="relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                :class="{ 'rounded-t-none border-t border-gray-200 focus:border-none': i > 0, 'rounded-b-none': i !== Object.keys(availableRoles).length - 1 }"
                                @click="addTeamMemberForm.role = role.key"
                            >
                                <div :class="{ 'opacity-50': addTeamMemberForm.role && addTeamMemberForm.role !== role.key }">
                                    <!-- Role Name -->
                                    <div class="flex items-center">
                                        <div class="text-sm text-gray-600" :class="{ 'font-semibold': addTeamMemberForm.role === role.key }">
                                            {{ role.name }}
                                        </div>

                                        <svg v-if="addTeamMemberForm.role === role.key" class="ms-2 size-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>

                                    <!-- Role Description -->
                                    <div class="mt-2 text-start text-xs text-gray-600">
                                        {{ role.description }}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </template>

                <template #actions>
                    <ActionMessage :on="addTeamMemberForm.recentlySuccessful" class="me-3">
                        Added.
                    </ActionMessage>

                    <PrimaryButton type="button" :class="{ 'opacity-25': addTeamMemberForm.processing }" :disabled="addTeamMemberForm.processing">
                        Add
                    </PrimaryButton>
                </template>
            </FormSection>
        </div>

        <div v-if="team.team_invitations.length > 0 && userPermissions.canAddTeamMembers">
            <SectionBorder />

            <!-- Team Member Invitations -->
            <ActionSection class="mt-10 sm:mt-0">
                <template #title>
                    Pending Team Invitations
                </template>

                <template #description>
                    These people have been invited to your team and have been sent an invitation email. They may join the team by accepting the email invitation.
                </template>

                <!-- Pending Team Member Invitation List -->
                <template #content>
                    <div class="space-y-6">
                        <div v-for="invitation in team.team_invitations" :key="invitation.id" class="flex items-center justify-between">
                            <div class="text-gray-600">
                                {{ invitation.email }}
                            </div>

                            <div class="flex items-center">
                                <!-- Cancel Team Invitation -->
                                <button
                                    v-if="userPermissions.canRemoveTeamMembers"
                                    class="ms-6 cursor-pointer text-sm text-red-500 focus:outline-none"
                                    @click="cancelTeamInvitation(invitation)"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </ActionSection>
        </div>

        <div v-if="team.users.length > 0">
            <SectionBorder />

            <!-- Manage Team Members -->
            <ActionSection class="mt-10 sm:mt-0">
                <template #title>
                    Team Members
                </template>

                <template #description>
                    All of the people that are part of this team.
                </template>

                <!-- Team Member List -->
                <template #content>
                    <div class="space-y-6">
                        <div v-for="user in team.users" :key="user.id" class="flex items-center justify-between">
                            <div class="flex items-center">
                                <img class="size-8 rounded-full object-cover" :src="user.profile_photo_url" :alt="user.name">
                                <div class="ms-4">
                                    {{ user.name }}
                                </div>
                            </div>

                            <div class="flex items-center">
                                <!-- Manage Team Member Role -->
                                <button
                                    v-if="userPermissions.canUpdateTeamMembers && availableRoles.length"
                                    class="ms-2 text-sm text-gray-400 underline"
                                    @click="manageRole(user)"
                                >
                                    {{ displayableRole(user.membership.role) }}
                                </button>

                                <div v-else-if="availableRoles.length" class="ms-2 text-sm text-gray-400">
                                    {{ displayableRole(user.membership.role) }}
                                </div>

                                <!-- Leave Team -->
                                <button
                                    v-if="$page.props.auth.user?.id === user.id"
                                    class="ms-6 cursor-pointer text-sm text-red-500"
                                    @click="confirmLeavingTeam"
                                >
                                    Leave
                                </button>

                                <!-- Remove Team Member -->
                                <button
                                    v-else-if="userPermissions.canRemoveTeamMembers"
                                    class="ms-6 cursor-pointer text-sm text-red-500"
                                    @click="confirmTeamMemberRemoval(user)"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </ActionSection>
        </div>

        <!-- Role Management Modal -->
        <DialogModal :show="currentlyManagingRole" @close="currentlyManagingRole = false">
            <template #title>
                Manage Role
            </template>

            <template #content>
                <div v-if="managingRoleFor">
                    <div class="relative z-0 mt-1 cursor-pointer rounded-lg border border-gray-200">
                        <button
                            v-for="(role, i) in availableRoles"
                            :key="role.key"
                            type="button"
                            class="relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            :class="{ 'rounded-t-none border-t border-gray-200 focus:border-none': i > 0, 'rounded-b-none': i !== Object.keys(availableRoles).length - 1 }"
                            @click="updateRoleForm.role = role.key"
                        >
                            <div :class="{ 'opacity-50': updateRoleForm.role && updateRoleForm.role !== role.key }">
                                <!-- Role Name -->
                                <div class="flex items-center">
                                    <div class="text-sm text-gray-600" :class="{ 'font-semibold': updateRoleForm.role === role.key }">
                                        {{ role.name }}
                                    </div>

                                    <svg v-if="updateRoleForm.role === role.key" class="ms-2 size-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <!-- Role Description -->
                                <div class="mt-2 text-xs text-gray-600">
                                    {{ role.description }}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </template>

            <template #footer>
                <SecondaryButton type="button" @click="currentlyManagingRole = false">
                    Cancel
                </SecondaryButton>

                <PrimaryButton
                    type="button"
                    class="ms-3"
                    :class="{ 'opacity-25': updateRoleForm.processing }"
                    :disabled="updateRoleForm.processing"
                    @click="updateRole"
                >
                    Save
                </PrimaryButton>
            </template>
        </DialogModal>

        <!-- Leave Team Confirmation Modal -->
        <ConfirmationModal :show="confirmingLeavingTeam" @close="confirmingLeavingTeam = false">
            <template #title>
                Leave Team
            </template>

            <template #content>
                Are you sure you would like to leave this team?
            </template>

            <template #footer>
                <SecondaryButton type="button" @click="confirmingLeavingTeam = false">
                    Cancel
                </SecondaryButton>

                <DangerButton
                    type="button"
                    class="ms-3"
                    :class="{ 'opacity-25': leaveTeamForm.processing }"
                    :disabled="leaveTeamForm.processing"
                    @click="leaveTeam"
                >
                    Leave
                </DangerButton>
            </template>
        </ConfirmationModal>

        <!-- Remove Team Member Confirmation Modal -->
        <ConfirmationModal :show="!!teamMemberBeingRemoved" @close="teamMemberBeingRemoved = null">
            <template #title>
                Remove Team Member
            </template>

            <template #content>
                Are you sure you would like to remove this person from the team?
            </template>

            <template #footer>
                <SecondaryButton type="button" @click="teamMemberBeingRemoved = null">
                    Cancel
                </SecondaryButton>

                <DangerButton
                    type="button"
                    class="ms-3"
                    :class="{ 'opacity-25': removeTeamMemberForm.processing }"
                    :disabled="removeTeamMemberForm.processing"
                    @click="removeTeamMember"
                >
                    Remove
                </DangerButton>
            </template>
        </ConfirmationModal>
    </div>
</template>
