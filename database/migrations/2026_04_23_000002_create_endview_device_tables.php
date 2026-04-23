<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trx_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('mst_companies')->restrictOnDelete();
            $table->foreignId('site_id')->nullable()->constrained('mst_sites')->nullOnDelete();
            $table->foreignId('current_user_id')->nullable()->constrained('mst_users')->nullOnDelete();
            $table->uuid('device_uuid')->unique();
            $table->string('agent_key', 100)->unique();
            $table->string('device_name', 200);
            $table->string('hostname', 200)->index();
            $table->string('fqdn')->nullable();
            $table->string('device_type', 50)->default('LAPTOP');
            $table->string('os_name', 100)->nullable();
            $table->string('os_version', 100)->nullable();
            $table->string('os_build', 100)->nullable();
            $table->string('os_architecture', 50)->nullable();
            $table->string('manufacturer', 150)->nullable();
            $table->string('model', 150)->nullable();
            $table->string('serial_number', 150)->nullable()->index();
            $table->string('bios_version', 100)->nullable();
            $table->string('cpu_name')->nullable();
            $table->integer('cpu_physical_cores')->nullable();
            $table->integer('cpu_logical_cores')->nullable();
            $table->bigInteger('total_memory_mb')->nullable();
            $table->string('mac_address', 50)->nullable();
            $table->string('ipv4_address', 50)->nullable();
            $table->string('ipv6_address', 100)->nullable();
            $table->string('last_logged_on_username', 150)->nullable();
            $table->dateTime('last_logon_at', 3)->nullable();
            $table->dateTime('enrolled_at', 3)->useCurrent();
            $table->dateTime('last_checkin_at', 3)->nullable()->index();
            $table->dateTime('last_inventory_at', 3)->nullable();
            $table->dateTime('last_metrics_at', 3)->nullable();
            $table->string('current_status_code', 30)->default('OFFLINE');
            $table->decimal('health_score', 5, 2)->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->boolean('is_deleted')->default(false);
            $table->timestamps(3);

            $table->foreign('current_status_code')->references('status_code')->on('mst_device_statuses')->restrictOnDelete();
            $table->index(['company_id', 'site_id']);
            $table->index(['company_id', 'current_status_code']);
            $table->index('current_user_id');
        });

        Schema::create('trx_device_agents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->unique()->constrained('trx_devices')->cascadeOnDelete();
            $table->string('agent_version', 50);
            $table->string('api_token_hash');
            $table->dateTime('token_issued_at', 3)->useCurrent();
            $table->dateTime('token_expires_at', 3)->nullable();
            $table->string('last_seen_ip', 50)->nullable();
            $table->string('last_seen_user_agent')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps(3);
        });

        Schema::create('trx_device_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('trx_devices')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('mst_users')->restrictOnDelete();
            $table->dateTime('assigned_at', 3)->useCurrent();
            $table->dateTime('unassigned_at', 3)->nullable();
            $table->string('assignment_notes', 500)->nullable();
            $table->timestamps(3);

            $table->index(['device_id', 'unassigned_at']);
            $table->index('user_id');
        });

        Schema::create('trx_device_checkins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('trx_devices')->cascadeOnDelete();
            $table->dateTime('checked_in_at', 3)->index();
            $table->string('status_code', 30);
            $table->string('agent_version', 50)->nullable();
            $table->string('current_user_name', 150)->nullable();
            $table->string('ip_address', 50)->nullable();
            $table->string('mac_address', 50)->nullable();
            $table->bigInteger('uptime_seconds')->nullable();
            $table->string('remarks', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('status_code')->references('status_code')->on('mst_device_statuses')->restrictOnDelete();
            $table->index(['device_id', 'checked_in_at']);
            $table->index('status_code');
        });

        Schema::create('trx_device_metric_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('trx_devices')->cascadeOnDelete();
            $table->dateTime('captured_at', 3)->index();
            $table->decimal('cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('cpu_temperature_c', 6, 2)->nullable();
            $table->decimal('cpu_health_percent', 5, 2)->nullable();
            $table->bigInteger('ram_total_mb')->nullable();
            $table->bigInteger('ram_used_mb')->nullable();
            $table->bigInteger('ram_free_mb')->nullable();
            $table->decimal('ram_usage_percent', 5, 2)->nullable();
            $table->decimal('total_storage_gb', 12, 2)->nullable();
            $table->decimal('used_storage_gb', 12, 2)->nullable();
            $table->decimal('free_storage_gb', 12, 2)->nullable();
            $table->decimal('storage_usage_percent', 5, 2)->nullable();
            $table->integer('battery_percent')->nullable();
            $table->decimal('battery_health_percent', 5, 2)->nullable();
            $table->integer('battery_cycle_count')->nullable();
            $table->boolean('is_charging')->nullable();
            $table->boolean('is_online')->default(true);
            $table->decimal('health_score', 5, 2)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['device_id', 'captured_at']);
        });

        Schema::create('trx_device_storage_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('metric_snapshot_id')->constrained('trx_device_metric_snapshots')->cascadeOnDelete();
            $table->foreignId('device_id')->constrained('trx_devices')->cascadeOnDelete();
            $table->string('drive_name', 50);
            $table->string('drive_label', 100)->nullable();
            $table->string('file_system', 50)->nullable();
            $table->decimal('total_gb', 12, 2)->nullable();
            $table->decimal('used_gb', 12, 2)->nullable();
            $table->decimal('free_gb', 12, 2)->nullable();
            $table->decimal('used_percent', 5, 2)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('device_id');
            $table->index('metric_snapshot_id');
            $table->index(['device_id', 'drive_name']);
        });

        Schema::create('trx_device_battery_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('trx_devices')->cascadeOnDelete();
            $table->dateTime('captured_at', 3);
            $table->integer('battery_percent')->nullable();
            $table->decimal('battery_health_percent', 5, 2)->nullable();
            $table->bigInteger('battery_design_capacity_mwh')->nullable();
            $table->bigInteger('battery_full_charge_capacity_mwh')->nullable();
            $table->integer('battery_cycle_count')->nullable();
            $table->string('battery_status', 50)->nullable();
            $table->boolean('is_charging')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['device_id', 'captured_at']);
        });

        Schema::create('trx_device_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('trx_devices')->cascadeOnDelete();
            $table->foreignId('metric_snapshot_id')->nullable()->constrained('trx_device_metric_snapshots')->nullOnDelete();
            $table->string('alert_code', 50)->index();
            $table->string('alert_name', 150);
            $table->string('severity_code', 20)->index();
            $table->string('alert_message', 500);
            $table->dateTime('opened_at', 3)->index();
            $table->dateTime('acknowledged_at', 3)->nullable();
            $table->dateTime('resolved_at', 3)->nullable();
            $table->foreignId('acknowledged_by')->nullable()->constrained('mst_users')->nullOnDelete();
            $table->foreignId('resolved_by')->nullable()->constrained('mst_users')->nullOnDelete();
            $table->string('status_code', 20)->default('OPEN')->index();
            $table->timestamps(3);

            $table->index('device_id');
        });

        Schema::create('trx_device_event_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('trx_devices')->cascadeOnDelete();
            $table->string('event_type', 50)->index();
            $table->string('event_source', 50)->default('AGENT');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->dateTime('event_at', 3);
            $table->string('event_message', 500)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('mst_users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['device_id', 'event_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trx_device_event_logs');
        Schema::dropIfExists('trx_device_alerts');
        Schema::dropIfExists('trx_device_battery_snapshots');
        Schema::dropIfExists('trx_device_storage_snapshots');
        Schema::dropIfExists('trx_device_metric_snapshots');
        Schema::dropIfExists('trx_device_checkins');
        Schema::dropIfExists('trx_device_assignments');
        Schema::dropIfExists('trx_device_agents');
        Schema::dropIfExists('trx_devices');
    }
};
