<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Finder\Finder;

class RemoveDarkCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jetstream:no-dark';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Removes dark classes from Jetstream components';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->removeDarkClasses((new Finder)
            ->in(resource_path('js'))
            ->name('*.vue')
            ->notPath('Pages/Home.vue')
        );

        return Command::SUCCESS;
    }

    /**
     * Remove Tailwind dark classes from the given files.
     *
     * @param  Finder  $finder
     * @return void
     */
    protected function removeDarkClasses(Finder $finder): void
    {
        foreach ($finder as $file) {
            file_put_contents($file->getPathname(), preg_replace('/\sdark:[^\s"\']+/', '', $file->getContents()));
        }
    }
}
