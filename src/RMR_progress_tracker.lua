-- load this script after loading RMR boot.lua

-- Copied from RMR AutoTracker.lua
local cpu = ew.cpu
local cWaitFrames = 120
local prevTitle = -1
local waitFrames = cWaitFrames

local function getTitle()
    local tmp = cpu[0x80FFC9] - 0x30
    if tmp < 0 then tmp = 1 end
    return tmp
end
-- Copied from RMR AutoTracker.lua end

-- Copied from RMR boot.lua
local addrItems = 0x7FFF00
local addrChecks = 0x7FFF60
local addrIFG = 0x7FFFAE
local cChecksPerTitle = 0x20
local cItems = 0x60
-- Copied from RMR boot.lua end

local function writeProgress(curTitle)
    local output = "window.RMRPTJS.progress={\n"

    -- items
    output = output .. '  "items": ['
    for i=0,cItems-1,1 do
        output = output .. cpu[addrItems + i]
        if (i ~= cItems-1) then
            output = output .. ","
        end
    end
    output = output .. "],\n"

    -- checks
    output = output .. '  "checks": ['
    for i=0,3*cChecksPerTitle-1,1 do
        output = output .. cpu[addrChecks + i]
        if (i ~= 3*cChecksPerTitle-1) then
            output = output .. ","
        end
    end
    output = output .. "],\n"

    -- ifg
    output = output .. '  "ifg": ' .. cpu[addrIFG] .. ',\n'

    -- currentGame
    output = output .. '  "currentGame": ' .. curTitle .. ',\n'

    output = output .. "}\n"

    local fh = io.open("progress.js","w")
    if fh then
        fh:write(output)
        fh:close()
    end
end

-- modified from AutoTracker
function getCurrentScreen(curTitle)
    local addrMap = {[1] = 0x7E00D1, [2] = 0x7E00D0, [3] = 0x7E00D0}
    return cpu[addrMap[curTitle]]
end


-- curTitle & some main loop logic is modified from RMR AutoTracker.lua
while true do
    ew.frameadvance()

    local curTitle = getTitle()
    local screen = getCurrentScreen(curTitle)
    if prevTitle ~= curTitle then
        prevTitle = curTitle
        waitFrames = cWaitFrames
    end
    waitFrames = waitFrames - 1

    if waitFrames <= 0 and -waitFrames % 10 == 0 then
        -- wait another 180 sec wait when still in title screen
        if screen == 0 then
            waitFrames = 180
        -- don't process until entering boss select
        elseif screen == 2 then
            writeProgress(curTitle)
        end
    end
end