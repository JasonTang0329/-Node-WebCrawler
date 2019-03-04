redis.call('SELECT', 0)

local name = ARGV[1]
local no = ARGV[2]
local number = ARGV[3]

redis.call('HSET', 'lottery_wn:' .. no, name, number)
redis.call('LREM', 'tag:lottery_wn', 0, no)
redis.call('RPUSH', 'tag:lottery_wn', no)