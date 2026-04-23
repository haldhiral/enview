<?php

use App\Models\Device;
use App\Models\DeviceAlert;
use App\Models\DeviceBatterySnapshot;
use App\Models\DeviceCheckin;
use App\Models\DeviceEventLog;
use App\Models\DeviceMetricSnapshot;
use App\Models\DeviceStatus;
use App\Models\DeviceStorageSnapshot;
use App\Models\Company;
use App\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    foreach ([
        ['ONLINE', 'Online', 1],
        ['OFFLINE', 'Offline', 2],
        ['WARNING', 'Warning', 3],
        ['CRITICAL', 'Critical', 4],
        ['INACTIVE', 'Inactive', 5],
    ] as [$code, $name, $rank]) {
        DeviceStatus::query()->create([
            'status_code' => $code,
            'status_name' => $name,
            'sort_order' => $rank,
            'is_active' => true,
        ]);
    }

    endviewCompanySite();
});

test('agent registration creates the current device agent and event log', function (): void {
    $deviceUuid = (string) Str::uuid();

    $response = $this->postJson('/api/agent/register', endviewRegisterPayload([
        'device_uuid' => $deviceUuid,
    ]));

    $response
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.device_uuid', $deviceUuid);

    $device = Device::query()->where('device_uuid', $deviceUuid)->firstOrFail();

    expect($device->hostname)->toBe('END-LAP-001')
        ->and($device->current_status_code)->toBe('ONLINE')
        ->and($device->agent()->first()->agent_version)->toBe('1.0.0');

    $this->assertDatabaseHas('trx_device_event_logs', [
        'device_id' => $device->id,
        'event_type' => 'REGISTERED',
    ]);
});

test('heartbeat inserts a checkin and updates current device state', function (): void {
    $device = endviewDevice(['current_status_code' => 'OFFLINE']);

    $response = $this->postJson('/api/agent/heartbeat', [
        'device_uuid' => $device->device_uuid,
        'checked_in_at' => now()->toISOString(),
        'current_user_name' => 'acme\\nora',
        'ip_address' => '10.24.12.55',
        'mac_address' => '02:42:ac:11:00:55',
        'uptime_seconds' => 12345,
        'agent_version' => '1.0.1',
        'remarks' => 'Heartbeat accepted',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.current_status_code', 'ONLINE');

    $device->refresh();

    expect(DeviceCheckin::query()->where('device_id', $device->id)->count())->toBe(1)
        ->and($device->last_logged_on_username)->toBe('acme\\nora')
        ->and($device->ipv4_address)->toBe('10.24.12.55')
        ->and($device->current_status_code)->toBe('ONLINE');

    $this->assertDatabaseHas('trx_device_event_logs', [
        'device_id' => $device->id,
        'event_type' => 'DEVICE_ONLINE',
    ]);
});

test('heartbeat returns a clean error for unknown devices', function (): void {
    $deviceUuid = (string) Str::uuid();

    $response = $this->postJson('/api/agent/heartbeat', [
        'device_uuid' => $deviceUuid,
        'checked_in_at' => now()->toISOString(),
        'agent_version' => '1.0.1',
    ]);

    $response
        ->assertNotFound()
        ->assertJsonPath('success', false)
        ->assertJsonPath('data.device_uuid', $deviceUuid);
});

test('metrics writes snapshots health score alerts and avoids duplicate open alerts', function (): void {
    $device = endviewDevice(['last_checkin_at' => now()]);
    $payload = endviewMetricsPayload([
        'device_uuid' => $device->device_uuid,
        'cpu_usage_percent' => 95.2,
        'ram_usage_percent' => 91.4,
        'storage_usage_percent' => 92.7,
        'battery_health_percent' => 55.5,
    ]);

    $response = $this->postJson('/api/agent/metrics', $payload);

    $response
        ->assertOk()
        ->assertJsonPath('data.health_score', 20.0)
        ->assertJsonPath('data.current_status_code', 'CRITICAL')
        ->assertJsonPath('data.alerts_opened', 4);

    expect(DeviceMetricSnapshot::query()->where('device_id', $device->id)->count())->toBe(1)
        ->and(DeviceStorageSnapshot::query()->where('device_id', $device->id)->count())->toBe(1)
        ->and(DeviceBatterySnapshot::query()->where('device_id', $device->id)->count())->toBe(1)
        ->and(DeviceAlert::query()->where('device_id', $device->id)->where('status_code', 'OPEN')->count())->toBe(4);

    $this->postJson('/api/agent/metrics', [
        ...$payload,
        'captured_at' => now()->addMinute()->toISOString(),
    ])->assertOk()
        ->assertJsonPath('data.alerts_opened', 0);

    expect(DeviceAlert::query()->where('device_id', $device->id)->where('status_code', 'OPEN')->count())->toBe(4);

    $this->postJson('/api/agent/metrics', endviewMetricsPayload([
        'device_uuid' => $device->device_uuid,
        'captured_at' => now()->addMinutes(2)->toISOString(),
        'cpu_usage_percent' => 30.0,
        'ram_usage_percent' => 45.0,
        'storage_usage_percent' => 50.0,
        'battery_health_percent' => 95.0,
    ]))->assertOk()
        ->assertJsonPath('data.alerts_resolved', 4);

    expect(DeviceAlert::query()->where('device_id', $device->id)->where('status_code', 'OPEN')->count())->toBe(0)
        ->and(DeviceAlert::query()->where('device_id', $device->id)->where('status_code', 'RESOLVED')->count())->toBe(4);
});

test('inventory updates hardware fields and writes an event', function (): void {
    $device = endviewDevice();

    $response = $this->postJson('/api/agent/inventory', [
        'device_uuid' => $device->device_uuid,
        'hostname' => 'END-LAP-001',
        'fqdn' => 'end-lap-001.corp.example',
        'os_name' => 'Windows',
        'os_version' => 'Windows 11 Pro 24H2',
        'os_build' => '26100.1',
        'os_architecture' => 'x64',
        'manufacturer' => 'Dell',
        'model' => 'Latitude 7450',
        'serial_number' => 'EV123456',
        'bios_version' => '1.2.3',
        'cpu_name' => 'Intel Core Ultra 7',
        'cpu_physical_cores' => 8,
        'cpu_logical_cores' => 12,
        'total_memory_mb' => 32768,
        'mac_address' => '02:42:ac:11:00:99',
        'ipv4_address' => '10.24.12.99',
        'ipv6_address' => 'fe80::242:acff:fe11:99',
        'last_logged_on_username' => 'acme\\apinya',
        'last_logon_at' => now()->subMinutes(30)->toISOString(),
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('success', true);

    $device->refresh();

    expect($device->model)->toBe('Latitude 7450')
        ->and($device->total_memory_mb)->toBe(32768)
        ->and($device->last_inventory_at)->not->toBeNull();

    expect(DeviceEventLog::query()
        ->where('device_id', $device->id)
        ->where('event_type', 'INVENTORY_UPDATED')
        ->exists())->toBeTrue();
});

test('agent payloads are validated', function (): void {
    $response = $this->postJson('/api/agent/metrics', [
        'device_uuid' => 'not-a-uuid',
        'captured_at' => 'not-a-date',
        'cpu_usage_percent' => 120,
        'drives' => [
            ['used_percent' => 200],
        ],
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'device_uuid',
            'captured_at',
            'cpu_usage_percent',
            'drives.0.drive_name',
            'drives.0.used_percent',
        ]);
});

function endviewDevice(array $overrides = []): Device
{
    $site = Site::query()->firstOrFail();

    return Device::query()->create([
        'company_id' => $site->company_id,
        'site_id' => $site->id,
        'device_uuid' => (string) Str::uuid(),
        'agent_key' => (string) Str::uuid(),
        'device_name' => 'END-LAP-001',
        'hostname' => 'END-LAP-001',
        'device_type' => 'LAPTOP',
        'os_name' => 'Windows',
        'os_version' => 'Windows 11 Pro',
        'current_status_code' => 'ONLINE',
        'health_score' => 100,
        'is_enabled' => true,
        'is_deleted' => false,
        ...$overrides,
    ]);
}

function endviewCompanySite(): Site
{
    $company = Company::query()->create([
        'company_code' => 'ENDVIEW-TEST',
        'company_name' => 'EndView Test Company',
        'is_active' => true,
    ]);

    return Site::query()->create([
        'company_id' => $company->id,
        'site_code' => 'HQ',
        'site_name' => 'Head Office',
        'site_type' => 'HQ',
        'country' => 'Thailand',
        'is_active' => true,
    ]);
}

function endviewRegisterPayload(array $overrides = []): array
{
    return [
        'device_uuid' => (string) Str::uuid(),
        'hostname' => 'END-LAP-001',
        'device_name' => 'END-LAP-001',
        'device_type' => 'LAPTOP',
        'fqdn' => 'end-lap-001.corp.example',
        'os_name' => 'Windows',
        'os_version' => 'Windows 11 Pro',
        'os_build' => '22631.4317',
        'os_architecture' => 'x64',
        'manufacturer' => 'Dell',
        'model' => 'Latitude 5420',
        'serial_number' => 'EV000001',
        'bios_version' => '1.0.0',
        'cpu_name' => 'Intel Core i5',
        'cpu_physical_cores' => 4,
        'cpu_logical_cores' => 8,
        'total_memory_mb' => 16384,
        'mac_address' => '02:42:ac:11:00:01',
        'ipv4_address' => '10.24.12.41',
        'ipv6_address' => 'fe80::242:acff:fe11:1',
        'current_user_name' => 'acme\\nora',
        'last_logged_on_username' => 'acme\\nora',
        'agent_version' => '1.0.0',
        ...$overrides,
    ];
}

function endviewMetricsPayload(array $overrides = []): array
{
    return [
        'device_uuid' => (string) Str::uuid(),
        'captured_at' => now()->toISOString(),
        'cpu_usage_percent' => 35.2,
        'cpu_temperature_c' => null,
        'cpu_health_percent' => null,
        'ram_total_mb' => 16384,
        'ram_used_mb' => 9000,
        'ram_free_mb' => 7384,
        'ram_usage_percent' => 54.93,
        'total_storage_gb' => 512,
        'used_storage_gb' => 340,
        'free_storage_gb' => 172,
        'storage_usage_percent' => 66.4,
        'battery_percent' => 87,
        'battery_health_percent' => 79.5,
        'battery_cycle_count' => 210,
        'is_charging' => true,
        'drives' => [
            [
                'drive_name' => 'C:',
                'drive_label' => 'System',
                'file_system' => 'NTFS',
                'total_gb' => 512,
                'used_gb' => 340,
                'free_gb' => 172,
                'used_percent' => 66.4,
            ],
        ],
        ...$overrides,
    ];
}
