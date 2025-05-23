'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@repo/button';
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  type Range,
} from '@repo/gantt';
import { EyeIcon, LinkIcon, TrashIcon } from '@repo/icons';
import groupBy from 'lodash.groupby';
import { useId, useState } from 'react';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const statuses = [
  { id: '1', name: 'Planned', color: '#6B7280' },
  { id: '2', name: 'In Progress', color: '#F59E0B' },
  { id: '3', name: 'Done', color: '#10B981' },
];

const users = [
  { id: '1', name: 'John Doe', image: 'https://avatars.githubusercontent.com/u/1' },
  { id: '2', name: 'Jane Smith', image: 'https://avatars.githubusercontent.com/u/2' },
  { id: '3', name: 'Bob Johnson', image: 'https://avatars.githubusercontent.com/u/3' },
  { id: '4', name: 'Alice Brown', image: 'https://avatars.githubusercontent.com/u/4' },
];

const exampleGroups = [
  { id: '1', name: 'Frontend Development' },
  { id: '2', name: 'Backend Development' },
  { id: '3', name: 'UI/UX Design' },
  { id: '4', name: 'Testing' },
  { id: '5', name: 'Documentation' },
  { id: '6', name: 'DevOps' },
];

const exampleProducts = [
  { id: '1', name: 'Web App' },
  { id: '2', name: 'Mobile App' },
  { id: '3', name: 'Desktop App' },
  { id: '4', name: 'API Services' },
];

const exampleInitiatives = [
  { id: '1', name: 'Q1 Goals' },
  { id: '2', name: 'Q2 Goals' },
];

const exampleReleases = [
  { id: '1', name: 'v1.0.0' },
  { id: '2', name: 'v1.1.0' },
  { id: '3', name: 'v1.2.0' },
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateFeatures = () => {
  // 使用当天的开始时间作为基准
  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Array.from({ length: 20 })
    .fill(null)
    .map((_, index) => {
      const durationWeeks = Math.floor(seededRandom(index * 2) * 7) + 1;
      const startOffset = Math.floor(seededRandom(index * 2 + 1) * 4) * 7;

      const startAt = new Date(baseDate.getTime() + (startOffset * 24 * 60 * 60 * 1000));
      const endAt = new Date(startAt.getTime() + (durationWeeks * 7 * 24 * 60 * 60 * 1000));

      return {
        id: `task-${index}`,
        name: `Task ${index + 1}`,
        startAt,
        endAt,
        status: statuses[index % statuses.length],
        owner: users[index % users.length],
        group: exampleGroups[index % exampleGroups.length],
        product: exampleProducts[index % exampleProducts.length],
        initiative: exampleInitiatives[index % exampleInitiatives.length],
        release: exampleReleases[index % exampleReleases.length],
        progress: Math.round((index % 10) * 10),
      };
    });
};

const generateMarkers = () => {
  const baseDate = new Date(2024, 0, 1);
  const markerColors = [
    'bg-blue-100 text-blue-900',
    'bg-green-100 text-green-900',
    'bg-purple-100 text-purple-900',
    'bg-red-100 text-red-900',
    'bg-orange-100 text-orange-900',
    'bg-teal-100 text-teal-900',
  ];

  return Array.from({ length: 6 })
    .fill(null)
    .map((_, index) => ({
      id: `marker-${index}`,
      date: new Date(baseDate.getTime() + (index * 14 * 24 * 60 * 60 * 1000)),
      label: `Milestone ${index + 1}`,
      className: markerColors[index % markerColors.length],
    }));
};

const Example = () => {
  const stableId = useId();
  const [features, setFeatures] = useState(generateFeatures());
  const [range, setRange] = useState<Range>('monthly');
  const [zoom, setZoom] = useState(100);

  // 按组排序特性
  const sortedFeatures = [...features].sort((a, b) => {
    // 按组名排序
    return a.group.name.localeCompare(b.group.name);
  });

  const groupedFeatures = groupBy(sortedFeatures, 'group.name');
  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleViewFeature = (id: string) =>
    console.log(`Feature selected: ${id}`);

  const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);

  const handleRemoveFeature = (id: string) =>
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));

  const handleRemoveMarker = (id: string) =>
    console.log(`Remove marker: ${id}`);

  const handleCreateMarker = (date: Date) =>
    console.log(`Create marker: ${date.toISOString()}`);

  const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return;
    }

    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, startAt, endAt } : feature
      )
    );

    console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
  };

  const handleAddFeature = (date: Date) =>
    console.log(`Add feature: ${date.toISOString()}`);

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <Select value={range} onValueChange={(value) => setRange(value as Range)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            disabled={zoom <= 50}
          >
            -
          </Button>
          <span className="min-w-[4rem] text-center">{zoom}%</span>
          <Button
            variant="outline"
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            disabled={zoom >= 200}
          >
            +
          </Button>
        </div>
      </div>
      <GanttProvider
        onAddItem={handleAddFeature}
        range={range}
        zoom={zoom}
        className="border"
      >
        <GanttSidebar>
          {Object.entries(sortedGroupedFeatures).map(([group, groupFeatures]) => (
            <GanttSidebarGroup key={group} name={group}>
              {groupFeatures.map((feature) => (
                <GanttSidebarItem
                  key={feature.id}
                  feature={feature}
                  onSelectItem={handleViewFeature}
                />
              ))}
            </GanttSidebarGroup>
          ))}
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            {Object.entries(sortedGroupedFeatures).map(([group, groupFeatures]) => (
              <GanttFeatureListGroup key={group}>
                {groupFeatures.map((feature) => (
                  <div className="flex" key={feature.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleViewFeature(feature.id)}
                        >
                          <GanttFeatureItem
                            onMove={handleMoveFeature}
                            {...feature}
                            progress={feature.progress}
                            id={`${stableId}-${feature.id}`}
                          >
                            <p className="flex-1 truncate text-xs">
                              {feature.name}
                            </p>
                            {feature.owner && (
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={feature.owner.image} />
                                <AvatarFallback>
                                  {feature.owner.name?.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </GanttFeatureItem>
                        </button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleViewFeature(feature.id)}
                        >
                          <EyeIcon size={16} className="text-muted-foreground" />
                          View feature
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleCopyLink(feature.id)}
                        >
                          <LinkIcon size={16} className="text-muted-foreground" />
                          Copy link
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="flex items-center gap-2 text-destructive"
                          onClick={() => handleRemoveFeature(feature.id)}
                        >
                          <TrashIcon size={16} />
                          Remove from roadmap
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                ))}
              </GanttFeatureListGroup>
            ))}
          </GanttFeatureList>
          {generateMarkers().map((marker) => (
            <GanttMarker
              key={marker.id}
              {...marker}
              id={`${stableId}-${marker.id}`}
              onRemove={handleRemoveMarker}
            />
          ))}
          <GanttToday />
          <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
        </GanttTimeline>
      </GanttProvider>
    </>
  );
};

export default Example;
