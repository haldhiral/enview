<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mst_companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_code', 50)->unique();
            $table->string('company_name', 200)->index();
            $table->boolean('is_active')->default(true);
            $table->timestamps(3);
        });

        Schema::create('mst_sites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('mst_companies')->restrictOnDelete();
            $table->string('site_code', 50);
            $table->string('site_name', 200);
            $table->string('site_type', 50)->nullable();
            $table->string('address', 500)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('country', 100)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps(3);

            $table->unique(['company_id', 'site_code']);
            $table->index(['company_id', 'site_name']);
        });

        Schema::create('mst_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('mst_companies')->restrictOnDelete();
            $table->foreignId('site_id')->nullable()->constrained('mst_sites')->nullOnDelete();
            $table->string('employee_no', 100)->nullable();
            $table->string('full_name', 200);
            $table->string('username', 100)->nullable();
            $table->string('email', 200)->nullable();
            $table->string('phone_no', 50)->nullable();
            $table->string('department_name', 100)->nullable();
            $table->string('job_title', 100)->nullable();
            $table->string('role_code', 50)->default('viewer')->index();
            $table->string('password_hash')->nullable();
            $table->boolean('is_active')->default(true);
            $table->dateTime('last_login_at', 3)->nullable();
            $table->timestamps(3);

            $table->unique(['company_id', 'username']);
            $table->unique(['company_id', 'email']);
            $table->index(['company_id', 'full_name']);
        });

        Schema::create('mst_device_statuses', function (Blueprint $table) {
            $table->string('status_code', 30)->primary();
            $table->string('status_name', 100);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps(3);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mst_device_statuses');
        Schema::dropIfExists('mst_users');
        Schema::dropIfExists('mst_sites');
        Schema::dropIfExists('mst_companies');
    }
};
