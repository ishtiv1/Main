<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resource;

class ResourcesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Resource::create([
            'name' => 'Sample Resource 1',
            'description' => 'This is a description of Sample Resource 1.',
            'type' => 'Type A',
        ]);

        Resource::create([
            'name' => 'Sample Resource 2',
            'description' => 'This is a description of Sample Resource 2.',
            'type' => 'Type B',
        ]);

        Resource::create([
            'name' => 'Sample Resource 3',
            'description' => 'This is a description of Sample Resource 3.',
            'type' => 'Type C',
        ]);
    }
}
