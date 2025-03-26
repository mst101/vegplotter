<script setup lang="ts">
import AuthenticationCard from '@/Components/AuthenticationCard.vue';
import Checkbox from '@/Components/Checkbox.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineOptions({
    layout: AppLayout,
});

const form = useForm({
    name: '',
    email: '',
    user_newsletter_consent: false,
    password: '',
    password_confirmation: '',
    terms: false,
});

function submit() {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
}
</script>

<template>
    <Head title="Register" />

    <div class="flex justify-center p-6">
        <div class="w-full text-3xl text-green-600 sm:max-w-md">
            <h1>
                Sign up for your free account
            </h1>
        </div>
    </div>

    <AuthenticationCard>
        <form @submit.prevent="submit">
            <!--            <div> -->
            <!--                <InputLabel for="name" value="Name" /> -->
            <!--                <TextInput -->
            <!--                    id="name" -->
            <!--                    v-model="form.name" -->
            <!--                    type="text" -->
            <!--                    class="mt-1 block w-full" -->
            <!--                    required -->
            <!--                    autofocus -->
            <!--                    autocomplete="name" -->
            <!--                /> -->
            <!--                <InputError v-if="form.errors?.name" class="mt-2" :message="form.errors.name" /> -->
            <!--            </div> -->

            <div>
                <InputLabel for="email" value="Email" />
                <TextInput
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full"
                    required
                    autocomplete="username"
                />
                <InputError v-if="form.errors?.email" class="mt-2" :message="form.errors.email" />
            </div>

            <div class="mt-4">
                <label class="flex items-start">
                    <Checkbox v-model:checked="form.user_newsletter_consent" class="mt-1" name="remember" />
                    <span class="ms-4 text-sm text-gray-600">Would you like to be included in our Monthly Newsletter? This is full of tips on vegetable gardening, especially getting the most out of VegPlotter and your garden. We also regularly provide discounts, competitions and giveaways for our garden planning software through our newsletter too.</span>
                </label>
            </div>

            <!--            <div class="mt-4"> -->
            <!--                <InputLabel for="password" value="Password" /> -->
            <!--                <TextInput -->
            <!--                    id="password" -->
            <!--                    v-model="form.password" -->
            <!--                    type="password" -->
            <!--                    class="mt-1 block w-full" -->
            <!--                    required -->
            <!--                    autocomplete="new-password" -->
            <!--                /> -->
            <!--                <InputError v-if="form.errors?.password" class="mt-2" :message="form.errors.password" /> -->
            <!--            </div> -->

            <!--            <div class="mt-4"> -->
            <!--                <InputLabel for="password_confirmation" value="Confirm Password" /> -->
            <!--                <TextInput -->
            <!--                    id="password_confirmation" -->
            <!--                    v-model="form.password_confirmation" -->
            <!--                    type="password" -->
            <!--                    class="mt-1 block w-full" -->
            <!--                    required -->
            <!--                    autocomplete="new-password" -->
            <!--                /> -->
            <!--                <InputError v-if="form.errors?.password_confirmation" class="mt-2" :message="form.errors.password_confirmation" /> -->
            <!--            </div> -->

            <!--            <div v-if="$page.props.jetstream.hasTermsAndPrivacyPolicyFeature" class="mt-4"> -->
            <!--                <InputLabel value="Terms" for="terms"> -->
            <!--                    <div class="flex items-center"> -->
            <!--                        <Checkbox id="terms" v-model:checked="form.terms" name="terms" required /> -->

            <!--                        <div class="ms-2"> -->
            <!--                            I agree to the <a target="_blank" :href="route('terms.show')" class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Terms of Service</a> and <a target="_blank" :href="route('policy.show')" class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Privacy Policy</a> -->
            <!--                        </div> -->
            <!--                    </div> -->
            <!--                    <InputError v-if="form.errors?.terms" class="mt-2" :message="form.errors.terms" /> -->
            <!--                </InputLabel> -->
            <!--            </div> -->

            <div class="mt-8 flex items-center justify-between">
                <div class="text-sm">
                    <p>
                        Already have an account?
                    </p>
                    <Link :href="route('login')" class="rounded-md text-sm text-purple-800 transition-all duration-200 hover:text-purple-900 hover:underline hover:drop-shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Log in instead
                    </Link>
                </div>

                <PrimaryButton type="submit" class="ms-4" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Create Account
                </PrimaryButton>
            </div>
        </form>
    </AuthenticationCard>
</template>
