<script lang="ts" setup>
import type { Nullable } from '@/types';
import AuthenticationCard from '@/Components/AuthenticationCard.vue';
import Checkbox from '@/Components/Checkbox.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import TextLink from '@/Components/TextLink.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

defineOptions({
    layout: AppLayout,
});

defineProps<{
    canResetPassword: boolean;
    status: Nullable<string>;
}>();

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

function submit() {
    form.transform(data => ({
        ...data,
        remember: form.remember ? 'on' : '',
    })).post(route('login'), {
        onFinish: () => form.reset('password'),
    });
}
</script>

<template>
    <Head title="Log in" />

    <div class="flex justify-center p-6">
        <div class="w-full text-3xl text-green-600 sm:max-w-md">
            <h1>
                Log in
            </h1>
        </div>
    </div>

    <AuthenticationCard>
        <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
            {{ status }}
        </div>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="email" value="Email" />
                <TextInput
                    id="email"
                    v-model="form.email"
                    autocomplete="username"
                    autofocus
                    class="mt-1 block w-full"
                    required
                    type="email"
                />
                <InputError v-if="form.errors?.email" :message="form.errors.email" class="mt-2" />
            </div>

            <div class="mt-4">
                <InputLabel for="password" value="Password" />
                <TextInput
                    id="password"
                    v-model="form.password"
                    autocomplete="current-password"
                    class="mt-1 block w-full"
                    required
                    type="password"
                />
                <InputError v-if="form.errors?.password" :message="form.errors.password" class="mt-2" />
            </div>

            <div class="mt-4 block">
                <label class="flex items-start">
                    <Checkbox v-model:checked="form.remember" class="mt-1" name="remember" />
                    <span class="ms-4 text-sm text-gray-600"><span class="font-semibold">Remember me</span> - saves a cookie on your machine so that you don't have to log in each time you access VegPlotter.</span>
                </label>
            </div>

            <div class="mt-4 flex items-center justify-between">
                <div class="flex flex-col">
                    <TextLink
                        v-if="canResetPassword" :href="route('register')"
                    >
                        Create an account
                    </TextLink>

                    <TextLink
                        v-if="canResetPassword" :href="route('password.request')"
                    >
                        Forgot your password?
                    </TextLink>
                </div>

                <PrimaryButton
                    :class="{ 'opacity-25': form.processing }" :disabled="form.processing" class="ms-4"
                    type="submit"
                >
                    Log in
                </PrimaryButton>
            </div>
        </form>
    </AuthenticationCard>
</template>
