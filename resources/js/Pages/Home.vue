<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import PageContainer from '@/Pages/PageContainer.vue';
import { Link } from '@inertiajs/vue3';

defineOptions({
    layout: AppLayout,
});

defineProps<{
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
}>();

function handleImageError() {
    document.getElementById('screenshot-container')?.classList.add('!hidden');
    document.getElementById('docs-card')?.classList.add('!row-span-1');
    document.getElementById('docs-card-content')?.classList.add('!flex-row');
    document.getElementById('background')?.classList.add('!hidden');
}
</script>

<template>
    <PageContainer title="Home">
        <div
            class="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white"
        >
            <div class="relative w-full max-w-2xl px-6 pb-20 lg:max-w-7xl">
                <main class="mt-6">
                    <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
                        <div id="screenshot-container" class="relative flex flex-col items-center sm:flex">
                            <div class="flex rounded-[10px] bg-pink-500 drop-shadow-lg sm:flex-col">
                                <img
                                    src="/images/vegetable-garden-planner-laptop-and-mobile-small-light.jpg"
                                    alt="Vegetable garden planner"
                                    class="aspect-auto size-full flex-1 rounded-[10px] object-cover dark:hidden"
                                    @error="handleImageError"
                                >
                                <img
                                    src="/images/vegetable-garden-planner-laptop-and-mobile-small-dark.jpg"
                                    alt="Vegetable garden planner"
                                    class="hidden aspect-auto size-full flex-1 rounded-[10px] object-cover dark:block"
                                >
                            </div>

                            <div class="mt-4 flex items-center text-center lg:flex-col">
                                <Link
                                    class="rounded bg-green-600 px-4 py-2 font-semibold text-white outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    :href="route('register')"
                                >
                                    Sign Up here<br>Free
                                    Garden Planner
                                </Link>
                            </div>
                        </div>

                        <div class="p-4 text-xl">
                            <p class="text-3xl leading-tight tracking-normal sm:text-4xl">
                                <span class="font-medium text-green-600">Get organised!</span> The easiest way to plan
                                your garden
                            </p>
                            <p class="mt-4">
                                We want you to triumph and deliver your most organised and productive vegetable
                                garden!
                            </p>

                            <p class="mt-4">
                                No more forgetting what you wanted to plant, when or where. You can design your garden
                                in minutes, using our Vegetable Garden Planner with its intuitive drag and drop
                                interface.
                            </p>

                            <p class="mt-4">
                                Then, plan out your planting calendar as far into the future as you want.
                            </p>
                        </div>
                    </div>

                    <hr class="mt-8">

                    <section class="py-4">
                        <h2 class="text-2xl font-semibold text-green-600">
                            What people have said...
                        </h2>
                        <div class="mt-6 grid gap-2 md:grid-cols-3">
                            <div
                                class="flex flex-col justify-between rounded-lg bg-green-50 p-4 shadow-md shadow-gray-300"
                            >
                                <p class="text-lg font-semibold text-green-700">
                                    "Fantastic! I’m thrilled. You’ve done truly excellent work and made a tool that has
                                    made gardening loads easier."
                                </p>
                                <p class="text-right text-lg text-green-700">
                                    VC Smith
                                </p>
                            </div>
                            <div
                                class="flex flex-col justify-between rounded-lg bg-green-50 p-4 shadow-md shadow-gray-300"
                            >
                                <p class="text-lg font-semibold text-green-700">
                                    "I just discovered your website over the weekend to plan my garden! It was very user
                                    friendly and helpful!!"
                                </p>
                                <p class="text-right text-lg text-green-700">
                                    S Watkins
                                </p>
                            </div>
                            <div
                                class="flex flex-col justify-between rounded-lg bg-green-50 p-4 shadow-md shadow-gray-300"
                            >
                                <p class="text-lg font-semibold text-green-700">
                                    "Thanks so much for that great app (saving lots of paper!). We are using it to plan
                                    all our garden this year and so far it's been quite a success."
                                </p>
                                <p class="text-right text-lg text-green-700">
                                    Anonymous
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr class="mt-8">

                    <section class="mt-8 text-xl">
                        <h1 class="text-3xl text-amber-700">
                            It's as simple as...
                        </h1>
                        <div class="mt-4 grid gap-8 md:grid-cols-4">
                            <div class="flex flex-col items-center">
                                <figure class="w-24">
                                    <img
                                        src="/images/gardenline.png"
                                        alt="icon showing a roll of twine for measuring your garden or allotment"
                                    >
                                </figure>
                                <h2 class="text-2xl text-amber-700">
                                    Measure out your plot
                                </h2>
                                <p class="mt-2">
                                    Using some twine or counting strides will quickly give you rough measurements of
                                    your plot and beds
                                </p>
                            </div>
                            <div class="flex flex-col items-center">
                                <figure class="w-24">
                                    <img src="/images/shedandbutt.png" alt="shed outline icon from vegplotter">
                                </figure>
                                <h2 class="text-2xl text-amber-700">
                                    Add beds, paths and structures
                                </h2>
                                <p class="mt-2">
                                    Use the simple drag and drop interface to add your plot
                                </p>
                            </div>
                            <div class="flex flex-col items-center">
                                <figure class="w-24">
                                    <img src="/images/addplants.png" alt="plant icon outlines from vegplotter">
                                </figure>
                                <h2 class="text-2xl text-amber-700">
                                    Plan your planting year
                                </h2>
                                <p class="mt-2">
                                    Plan your garden/allotment month by month adding plants as they go in or plan
                                    months/years ahead
                                </p>
                            </div>
                            <div class="flex flex-col items-center">
                                <figure class="w-24">
                                    <img src="/images/todolist.png" alt="graphic showing checklist of planting jobs">
                                </figure>
                                <h2 class="text-2xl text-amber-700">
                                    Check your plans
                                </h2>
                                <p class="mt-2">
                                    Use your smartphone to check/update your monthly plans from your allotment or garden
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- class="delaybgload mt-8 py-6" -->
                    <section
                        class="mt-8 py-6"
                        data-style="background-image: url('/images/slider6.jpg'); background-size: cover;"
                        style="background-image: url('/images/slider6.jpg'); background-size: cover;"
                    >
                        <div class="m-4 max-w-lg rounded bg-white p-4 text-center">
                            <h1 class="text-3xl font-semibold text-green-600">
                                Simple drag and drop interface
                            </h1>
                            <p class="mt-4 block text-xl">
                                Easy for everyone to use! All can have a garden planned in minutes.
                            </p>
                            <div class="mt-4">
                                <figure>
                                    <video
                                        poster="/images/screencast-draganddrop-poster.jpg"
                                        autoplay muted loop
                                    >
                                        <source src="/images/screencast-draganddrop-2022.webm" type="video/webm">
                                        <source src="/images/screencast-draganddrop-2022.mp4" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </figure>
                            </div>
                        </div>
                    </section>

                    <section class="py-8">
                        <h1 class="text-3xl font-semibold text-green-600">
                            Extensive Features...
                        </h1>
                        <div class="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div class="rounded-lg bg-white p-4 shadow-lg">
                                <h2 class="text-2xl text-green-600">
                                    Unique Month by Month approach
                                </h2>
                                <p class="mt-4">
                                    With our month by month approach you can plan all aspects of your vegetable garden
                                    as far in to the future as you need...
                                </p>
                                <p class="mt-4">
                                    from when to sow your seed, to when to put up your plant supports or cloches.
                                </p>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow-lg">
                                <h2 class="text-2xl text-green-600">
                                    Companion Planting
                                </h2>
                                <p class="mt-4">
                                    Our Garden Planner lets you know what plants go well together.
                                </p>
                                <p class="mt-4">
                                    Select a plant on your plan and a list of good companions for it appears in the
                                    menu.
                                </p>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow-lg">
                                <h2 class="text-2xl text-green-600">
                                    Crop Rotation Conflicts
                                </h2>
                                <p class="mt-4">
                                    Avoid plant pests and diseases.
                                </p>
                                <p class="mt-4">
                                    The planner will warn you if your are planning to put similar plants in the same
                                    spot.
                                </p>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow-lg">
                                <h2 class="text-2xl text-green-600">
                                    Journal Your Progress
                                </h2>
                                <p class="mt-4">
                                    Track and record the progress of your garden plan by adding notes and photos to
                                    items on your garden plan.
                                </p>
                                <p class="mt-4">
                                    Never forget planting instructions: Take a picture of your the seed packets and
                                    upload the the planting row in your garden plan.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section class="mt-8">
                        <div class="flex flex-col items-center">
                            <h1 class="text-2xl text-amber-700">
                                Works with the latest web browsers...
                            </h1>
                            <figure class="mt-4 max-w-56">
                                <img
                                    src="/images/crossbrowser.jpg"
                                    alt="Icons of all the popular browsers that our Vegetable Garden Planner supports"
                                >
                            </figure>
                            <h2 class="mt-4 text-2xl text-amber-700">
                                ...On desktop, laptop, tablet and mobile
                            </h2>
                            <figure class="mt-4 max-w-56">
                                <img
                                    src="/images/multidevice.png"
                                    alt="Icons for desktop laptop tablet and mobile showing that our vegetable garden planner works on each"
                                >
                            </figure>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    </PageContainer>
</template>
