redis.call('SELECT', 0)

local no = ARGV[1]

redis.call('LREM', 'wait_lottery_pk', 0, no)
redis.call('RPUSH', 'wait_lottery_pk', no)