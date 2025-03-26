<script setup lang="ts">
import Banner from '@/Components/Banner.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import NavLink from '@/Components/NavLink.vue';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';

const showingNavigationDropdown = ref(false);

function logout() {
    router.post(route('logout'));
}
</script>

<template>
    <div>
        <Banner />

        <div class="min-h-screen bg-gray-200">
            <nav class="border-b border-gray-100 bg-gray-100">
                <!-- Primary Navigation Menu -->
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="flex h-16 justify-between">
                        <div class="flex">
                            <!-- Logo -->
                            <div class="flex shrink-0 items-center">
                                <Link class="rounded outline-none focus:ring-2 focus:ring-green-500" :href="route('home')">
                                    <img class="w-40" src="/images/logo-long.png" alt="VegPlotter Garden Planner">
                                </Link>
                            </div>

                            <!-- Navigation Links -->
                            <div class="hidden sm:-my-px sm:ms-10 sm:flex sm:items-stretch">
                                <Dropdown class="flex" align="left" width="72">
                                    <template #trigger>
                                        <button
                                            type="button"
                                            class="inline-flex h-full items-center rounded border border-transparent px-3 py-2 font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 active:bg-gray-300"
                                        >
                                            My Plots
                                            <svg
                                                class="-me-0.5 ms-2 size-4" xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                stroke="currentColor"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                            /></svg>
                                        </button>
                                    </template>

                                    <template #content>
                                        <div>
                                            <!-- My Plots -->
                                            <DropdownLink v-if="$page.props.auth.user" :href="route('dashboard')">
                                                My first plot
                                            </DropdownLink>

                                            <DropdownLink v-else :href="route('login')">
                                                Log in to view your plots
                                            </DropdownLink>
                                        </div>
                                    </template>
                                </Dropdown>

                                <NavLink :href="route('dashboard')" :active="route().current('dashboard')">
                                    My Jobs
                                </NavLink>

                                <NavLink :href="route('dashboard')" :active="route().current('dashboard')">
                                    Plants
                                </NavLink>

                                <Dropdown class="flex" align="left" width="72">
                                    <template #trigger>
                                        <span class="">
                                            <button
                                                type="button"
                                                class="inline-flex h-full items-center rounded border border-transparent px-3 py-2 font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 active:bg-gray-300"
                                            >
                                                More
                                                <svg
                                                    class="-me-0.5 ms-2 size-4" xmlns="http://www.w3.org/2000/svg"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor"
                                                ><path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                /></svg>
                                            </button>
                                        </span>
                                    </template>

                                    <template #content>
                                        <div>
                                            <!-- More -->
                                            <DropdownLink :href="route('login')">
                                                About
                                            </DropdownLink>

                                            <DropdownLink :href="route('dashboard')">
                                                Pricing
                                            </DropdownLink>

                                            <DropdownLink :href="route('dashboard')">
                                                Blog
                                            </DropdownLink>

                                            <DropdownLink :href="route('dashboard')">
                                                Schools &amp; Teachers
                                            </DropdownLink>

                                            <DropdownLink :href="route('dashboard')">
                                                Help Centre
                                            </DropdownLink>

                                            <hr>

                                            <DropdownLink :href="route('dashboard')">
                                                Contact
                                            </DropdownLink>
                                        </div>
                                    </template>
                                </Dropdown>
                            </div>
                        </div>

                        <div class="hidden sm:ms-6 sm:flex sm:items-center">
                            <!-- Settings Dropdown -->
                            <div v-if="$page.props.auth.user" class="relative ms-3">
                                <div class="inline-flex rounded-md">
                                    <Link
                                        :active="false"
                                        class="inline-flex items-center rounded border border-transparent bg-green-600 px-4 text-xs font-medium uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-green-700 focus:bg-green-700 focus:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-800 disabled:opacity-50"
                                        :href="route('profile.show')"
                                    >
                                        Account
                                    </Link>

                                    <!-- Authentication -->
                                    <form @submit.prevent="logout">
                                        <SecondaryButton
                                            type="submit"
                                            class="ml-2 rounded bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                        >
                                            Log Out
                                        </SecondaryButton>
                                    </form>
                                </div>
                            </div>

                            <div v-else>
                                <NavLink
                                    :href="route('register')"
                                    class="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 focus:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:text-white"
                                    :active="route().current('register')"
                                >
                                    Sign up
                                </NavLink>

                                <NavLink
                                    :href="route('login')" class="ml-2 rounded px-4 py-2 text-sm hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    :active="route().current('dashboard')"
                                >
                                    Log in
                                </NavLink>
                            </div>
                        </div>

                        <!-- Hamburger -->
                        <div
                            class="-me-2 flex items-center sm:hidden"
                        >
                            <button
                                class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                @click="showingNavigationDropdown = !showingNavigationDropdown"
                            >
                                <svg
                                    class="size-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        :class="{ 'hidden': showingNavigationDropdown, 'inline-flex': !showingNavigationDropdown }"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        :class="{ 'hidden': !showingNavigationDropdown, 'inline-flex': showingNavigationDropdown }"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Responsive Navigation Menu -->
                <div
                    :class="{ block: showingNavigationDropdown, hidden: !showingNavigationDropdown }"
                    class="sm:hidden"
                    @click="showingNavigationDropdown = !showingNavigationDropdown"
                >
                    <div class="block px-4 py-2 text-xs text-gray-400">
                        My Plots
                    </div>

                    <ResponsiveNavLink
                        v-if="$page.props.auth.user"
                        as="link" :href="route('dashboard')"
                        :active="route().current('dashboard')"
                    >
                        My first plot
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                        v-else
                        as="link" :href="route('login')"
                        :active="route().current('login')"
                    >
                        Log in to view my plots
                    </ResponsiveNavLink>

                    <ResponsiveNavLink :href="route('dashboard')" :active="route().current('dashboard')">
                        My Jobs
                    </ResponsiveNavLink>

                    <ResponsiveNavLink :href="route('dashboard')" :active="route().current('dashboard')">
                        Plants
                    </ResponsiveNavLink>

                    <!-- More -->
                    <div class="block px-4 py-2 text-xs text-gray-400">
                        More
                    </div>

                    <ResponsiveNavLink :href="route('dashboard')" :active="route().current('dashboard')">
                        About
                    </ResponsiveNavLink>

                    <DropdownLink :href="route('dashboard')">
                        Pricing
                    </DropdownLink>

                    <DropdownLink :href="route('dashboard')">
                        Blog
                    </DropdownLink>

                    <DropdownLink :href="route('dashboard')">
                        Schools &amp; Teachers
                    </DropdownLink>

                    <DropdownLink :href="route('dashboard')">
                        Help Centre
                    </DropdownLink>

                    <hr>

                    <DropdownLink :href="route('dashboard')">
                        Contact
                    </DropdownLink>

                    <!-- Responsive Settings Options -->
                    <div class="border-t border-gray-200 py-4">
                        <div class="ml-4 flex">
                            <ResponsiveNavLink
                                :href="route('profile.show')"
                                :active="route().current('profile.show')"
                            >
                                Account
                            </ResponsiveNavLink>

                            <!--                            &lt;!&ndash; Authentication &ndash;&gt; -->
                            <!--                            <form v-if="$page.props.auth.user" method="POST" @submit.prevent="logout"> -->
                            <!--                                <ResponsiveNavLink as="button" :active="false"> -->
                            <!--                                    Log Out -->
                            <!--                                </ResponsiveNavLink> -->
                            <!--                            </form> -->

                            <Link
                                :active="false"
                                class="inline-flex items-center rounded border border-transparent bg-green-600 px-4 text-xs font-medium uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-800 disabled:opacity-50"
                                :href="route('profile.show')"
                            >
                                Account
                            </Link>

                            <!-- Authentication -->
                            <form @submit.prevent="logout">
                                <SecondaryButton
                                    type="submit"
                                    class="ml-2 rounded bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                >
                                    Log Out
                                </SecondaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Page Content -->
            <main class="bg-gray-50 text-gray-800">
                <slot />
                <div id="container" class="mt-4" />
            </main>
        </div>
    </div>
</template>
